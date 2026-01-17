const express = require('express');
const multer = require('multer');
const puppeteer = require('puppeteer');
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
    if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
      cb(null, true);
    } else {
      cb(new Error('Only HTML files are allowed'), false);
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

// Convert HTML to PDF endpoint
router.post('/', upload.single('file'), async (req, res) => {
  let browser;
  try {
    if (!req.file) {
      throw new PDFProcessingError('HTML file is required', 400);
    }

    if (req.file.size > 50 * 1024 * 1024) {
      throw new PDFProcessingError('File size exceeds 50MB limit', 413);
    }

    const htmlContent = req.file.buffer.toString('utf8');

    if (!htmlContent || htmlContent.trim().length === 0) {
      throw new PDFProcessingError('HTML content is empty', 422);
    }

    // Launch Puppeteer
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
    res.send(pdfBuffer);

    // Clean up: files are in memory, no temp files to delete
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting HTML to PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to convert HTML to PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;