const express = require('express');
const multer = require('multer');
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
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

    const { position = 'bottom-right', format = '1', start_index = 1 } = req.body;
    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const startIndexInt = parseInt(start_index) || 1;

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const fontSize = 12;
      
      let text = '';
      const pageNum = index + startIndexInt;
      
      if (format === 'i') {
        // Simple roman numeral converter for demo
        const roman = ["", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
        text = roman[pageNum] || pageNum.toString();
      } else if (format === 'I') {
        const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
        text = roman[pageNum] || pageNum.toString();
      } else {
        text = pageNum.toString();
      }

      const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
      const margin = 20;

      let x, y;

      switch (position) {
        case 'top-left':
          x = margin;
          y = height - margin - fontSize;
          break;
        case 'top-right':
          x = width - margin - textWidth;
          y = height - margin - fontSize;
          break;
        case 'bottom-left':
          x = margin;
          y = margin;
          break;
        case 'bottom-right':
        default:
          x = width - margin - textWidth;
          y = margin;
          break;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    });

    const newPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="numbered.pdf"');
    res.send(Buffer.from(newPdfBytes));

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error adding page numbers:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to add page numbers',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
