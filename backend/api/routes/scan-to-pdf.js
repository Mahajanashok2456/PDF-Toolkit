const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sentry = require('@sentry/node');

const router = express.Router();

// Configure multer with file validation for images
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
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

// Scan to PDF endpoint
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new PDFProcessingError('At least one image file is required', 400);
    }

    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      throw new PDFProcessingError('Total file size exceeds 50MB limit', 413);
    }

    const doc = new PDFDocument({ autoFirstPage: false });
    const buffers = [];

    // Pipe the PDF into a buffer
    doc.pipe(Buffer.concatStream((buffer) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="scanned.pdf"');
      res.send(buffer);
    }));

    for (const file of req.files) {
      try {
        // Use sharp to process the image (e.g., resize if needed, but here just get buffer)
        const imageBuffer = await sharp(file.buffer)
          .resize({ width: 595, height: 842, fit: 'inside' }) // A4 size approximation
          .jpeg({ quality: 80 })
          .toBuffer();

        doc.addPage().image(imageBuffer, 0, 0, { width: 595, height: 842 });
      } catch (imageError) {
        throw new PDFProcessingError(`Invalid image file: ${file.originalname}`, 400);
      }
    }

    doc.end();

    // Clean up: files are in memory, no temp files to delete
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error scanning to PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to scan to PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;