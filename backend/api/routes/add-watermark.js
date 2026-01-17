const express = require('express');
const multer = require('multer');
const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
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

    const { text = 'CONFIDENTIAL', opacity = '0.5', rotation = '45' } = req.body;
    
    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const opacityFloat = parseFloat(opacity);
    const rotationFloat = parseFloat(rotation);

    pages.forEach(page => {
      const { width, height } = page.getSize();
      const fontSize = 50;
      const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
      const textHeight = helveticaFont.heightAtSize(fontSize);

      // Center the watermark
      const x = (width - textWidth) / 2;
      const y = (height - textHeight) / 2;

      page.drawText(text, {
        x: width / 2 - textWidth / 2, // Approximate centering
        y: height / 2,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.7, 0.7, 0.7), // Light gray
        opacity: isNaN(opacityFloat) ? 0.5 : opacityFloat,
        rotate: degrees(isNaN(rotationFloat) ? 45 : rotationFloat),
      });
    });

    const newPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="watermarked.pdf"');
    res.send(Buffer.from(newPdfBytes));

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error adding watermark:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to add watermark',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
