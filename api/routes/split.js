const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sentry = require('@sentry/node');

const router = express.Router();

// Configure multer with file validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Custom error class for better error handling
class PDFProcessingError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'PDFProcessingError';
  }
}

// Helper function to delete temp files
const deleteTempFiles = (files) => {
  files.forEach(file => {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

// Split PDF endpoint
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    if (req.file.size > 50 * 1024 * 1024) {
      throw new PDFProcessingError('File size exceeds 50MB limit', 413);
    }

    const { startPage = 1, endPage } = req.body;
    const pdfBytes = req.file.buffer;
    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(pdfBytes);
    } catch (loadError) {
      throw new PDFProcessingError('Invalid or corrupted PDF file', 400);
    }
    const totalPages = pdfDoc.getPageCount();

    const start = Math.max(1, parseInt(startPage));
    const end = Math.min(totalPages, parseInt(endPage) || totalPages);

    if (start > end || start > totalPages || end < 1) {
      throw new PDFProcessingError('Invalid page range', 400);
    }

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdfDoc, Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i));
    pages.forEach(page => newPdf.addPage(page));

    const splitPdfBytes = await newPdf.save();

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="split.pdf"');
    res.send(Buffer.from(splitPdfBytes));

    // Clean up: files are in memory, no temp files to delete
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error splitting PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to split PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;