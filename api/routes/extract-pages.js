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

// Extract pages endpoint
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    let { pagesToExtract } = req.body;
    if (typeof pagesToExtract === 'string') {
      try {
        pagesToExtract = JSON.parse(pagesToExtract);
      } catch (e) {
        // ignore, validation will fail below
      }
    }

    if (!pagesToExtract || !Array.isArray(pagesToExtract) || pagesToExtract.length === 0) {
      throw new PDFProcessingError('Pages to extract must be provided as an array', 400);
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    // Validate page numbers (1-based)
    const invalidPages = pagesToExtract.filter(page => page < 1 || page > totalPages);
    if (invalidPages.length > 0) {
      throw new PDFProcessingError(`Invalid page numbers: ${invalidPages.join(', ')}`, 400);
    }

    // Extract pages (pdf-lib indices are 0-based)
    const pagesToCopy = pagesToExtract.map(page => page - 1).sort((a, b) => a - b);

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
    copiedPages.forEach(page => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="extracted-pages.pdf"');
    res.send(Buffer.from(newPdfBytes));

    // Clean up: files are in memory, no temp files to delete
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error extracting pages:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to extract pages',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;