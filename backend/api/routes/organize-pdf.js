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

// Organize PDF endpoint
router.post('/', upload.array('pdfs', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new PDFProcessingError('At least one PDF file is required', 400);
    }

    const { newOrder } = req.body;
    let totalPages = 0;
    const pdfDocs = [];

    // Load all PDFs and calculate total pages
    for (const file of req.files) {
      const pdfDoc = await PDFDocument.load(file.buffer);
      pdfDocs.push(pdfDoc);
      totalPages += pdfDoc.getPageCount();
    }

    if (newOrder && Array.isArray(newOrder) && newOrder.length > 0) {
      // Validate page numbers (1-based)
      const invalidPages = newOrder.filter(page => page < 1 || page > totalPages);
      if (invalidPages.length > 0) {
        throw new PDFProcessingError(`Invalid page numbers: ${invalidPages.join(', ')}`, 400);
      }

      // Check for duplicates or missing pages
      const uniqueOrder = [...new Set(newOrder)];
      if (uniqueOrder.length !== totalPages) {
        throw new PDFProcessingError('New order must include all pages without duplicates', 400);
      }
    }

    const newPdf = await PDFDocument.create();
    let pageIndex = 0;

    if (newOrder && Array.isArray(newOrder) && newOrder.length > 0) {
      // Organize pages based on newOrder
      if (req.files.length > 1) {
        throw new PDFProcessingError('New order is not supported for multiple PDFs. Merging in file order.', 400);
      }
      
      const pagesToCopy = newOrder.map(page => page - 1);
      const copiedPages = await newPdf.copyPages(pdfDocs[0], pagesToCopy);
      copiedPages.forEach(page => newPdf.addPage(page));
    } else {
      // Merge all PDFs in order
      for (const pdfDoc of pdfDocs) {
        const pages = pdfDoc.getPages();
        const copiedPages = await newPdf.copyPages(pdfDoc, pages.map((_, i) => i));
        copiedPages.forEach(page => newPdf.addPage(page));
      }
    }

    const newPdfBytes = await newPdf.save();

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="organized.pdf"');
    res.send(Buffer.from(newPdfBytes));

    // Clean up: files are in memory, no temp files to delete
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error organizing PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to organize PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;