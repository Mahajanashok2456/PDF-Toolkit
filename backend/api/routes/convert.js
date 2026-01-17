const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
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

// Convert PDF to text endpoint
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    if (req.file.size > 50 * 1024 * 1024) {
      throw new PDFProcessingError('File size exceeds 50MB limit', 413);
    }

    const pdfBytes = req.file.buffer;
    let data;
    try {
      data = await pdfParse(pdfBytes);
    } catch (parseError) {
      throw new PDFProcessingError('Invalid or corrupted PDF file', 400);
    }

    if (!data.text || data.text.trim().length === 0) {
      throw new PDFProcessingError('PDF contains no extractable text', 422);
    }

    // Set response headers for text download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.txt"');
    res.send(data.text);

    // Clean up: files are in memory, no temp files to delete
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to convert PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;