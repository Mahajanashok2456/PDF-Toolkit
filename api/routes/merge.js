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

// Merge PDFs endpoint
router.post('/', upload.array('pdfs', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      throw new PDFProcessingError('At least 2 PDF files are required', 400);
    }

    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      throw new PDFProcessingError('Total file size exceeds 50MB limit', 413);
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      try {
        const pdfBytes = file.buffer;
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      } catch (loadError) {
        throw new PDFProcessingError(`Invalid PDF file: ${file.originalname}`, 400);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
    res.send(Buffer.from(mergedPdfBytes));

    // Clean up: files are in memory, no temp files to delete
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error merging PDFs:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to merge PDFs',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;