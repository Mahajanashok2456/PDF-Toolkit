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
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.originalname.endsWith('.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx files are allowed'), false);
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

// Convert EXCEL to PDF endpoint
router.post('/', upload.single('file'), async (req, res) => {
  let browser;
  try {
    if (!req.file) {
      throw new PDFProcessingError('Excel file is required', 400);
    }

    if (req.file.size > 50 * 1024 * 1024) {
      throw new PDFProcessingError('File size exceeds 50MB limit', 413);
    }

    // Note: Converting XLSX to PDF directly with Puppeteer is not straightforward.
    // This implementation assumes additional libraries or services are used.
    // For now, using a placeholder.

    const xlsxBuffer = req.file.buffer;

    // Placeholder: In a real implementation, use a library like 'office-to-pdf' or a service.
    // For example, save the file and use an external tool.

    // Launch Puppeteer (example for HTML-based conversion)
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Assuming we have HTML content from Excel, but since we don't, throw error
    throw new PDFProcessingError('Excel to PDF conversion requires additional setup or libraries', 501);

    // If HTML is available:
    // await page.setContent(html, { waitUntil: 'networkidle0' });
    // const pdfBuffer = await page.pdf({ format: 'A4' });

    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
    // res.send(pdfBuffer);

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting EXCEL to PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to convert EXCEL to PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;