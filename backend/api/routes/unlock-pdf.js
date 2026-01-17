const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const Sentry = require('@sentry/node');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

class PDFProcessingError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'PDFProcessingError';
  }
}

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    const { password } = req.body;
    
    if (!password) {
      throw new PDFProcessingError('Password is required', 400);
    }

    const pdfBytes = req.file.buffer;
    
    // Load with password
    // If password is wrong, load will throw error
    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(pdfBytes, { password });
    } catch (e) {
      // Differentiate between "Encrypted PDF" error and others if possible
      // pdf-lib throws "PasswordRequiredError" or "IncorrectPasswordError"
      if (e.message.includes('Password') || e.message.includes('Encrypted')) {
          throw new PDFProcessingError('Incorrect password or file is not encrypted', 401);
      }
      throw e;
    }

    // Save without encryption (decrypted)
    const newPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="unlocked.pdf"');
    res.send(Buffer.from(newPdfBytes));

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error unlocking PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to unlock PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
