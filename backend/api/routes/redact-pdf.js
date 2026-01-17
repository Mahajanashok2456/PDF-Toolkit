const express = require('express');
const multer = require('multer');
const { PDFDocument, rgb } = require('pdf-lib');
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

    // redactions is an array of objects: { pageIndex, x, y, width, height }
    let { redactions } = req.body;
    
    if (typeof redactions === 'string') {
        try {
            redactions = JSON.parse(redactions);
        } catch (e) {
            // ignore
        }
    }

    if (!redactions || !Array.isArray(redactions) || redactions.length === 0) {
      throw new PDFProcessingError('Redactions array is required', 400);
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    redactions.forEach(r => {
        const pageIdx = parseInt(r.pageIndex);
        if (pageIdx >= 0 && pageIdx < pages.length) {
            const page = pages[pageIdx];
            const x = parseFloat(r.x);
            const y = parseFloat(r.y);
            const w = parseFloat(r.width);
            const h = parseFloat(r.height);
            
            // Draw black rectangle
            page.drawRectangle({
                x,
                y,
                width: w,
                height: h,
                color: rgb(0, 0, 0),
                opacity: 1, // Opaque
            });
        }
    });

    // Flattening? pdf-lib doesn't support full flattening of form fields or annotations easily in all cases,
    // but drawing a rectangle over content "hides" it visually. 
    // True redaction requires removing the underlying text/image data, which pdf-lib doesn't fully support yet (content stream editing is complex).
    // For now, this is a "visual redaction" (covering).
    // To make it safer, we can try to flatten forms if any.
    
    const form = pdfDoc.getForm();
    if (form) {
        try {
            form.flatten();
        } catch (e) {
            // ignore if no fields to flatten
        }
    }

    const newPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="redacted.pdf"');
    res.send(Buffer.from(newPdfBytes));

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error redacting PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to redact PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
