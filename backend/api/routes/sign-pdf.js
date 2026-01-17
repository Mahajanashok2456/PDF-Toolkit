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
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'), false);
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

// Upload both PDF and signature image
router.post('/', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'signature', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.pdf || !req.files.pdf[0]) {
      throw new PDFProcessingError('PDF file is required', 400);
    }
    if (!req.files.signature || !req.files.signature[0]) {
      throw new PDFProcessingError('Signature image is required', 400);
    }

    const { x = 100, y = 100, width = 150, height = 50, pageIndex = 0 } = req.body;

    const pdfBytes = req.files.pdf[0].buffer;
    const signatureBytes = req.files.signature[0].buffer;
    const signatureType = req.files.signature[0].mimetype;

    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    let signatureImage;
    if (signatureType === 'image/jpeg' || signatureType === 'image/jpg') {
        signatureImage = await pdfDoc.embedJpg(signatureBytes);
    } else if (signatureType === 'image/png') {
        signatureImage = await pdfDoc.embedPng(signatureBytes);
    } else {
        throw new PDFProcessingError('Signature must be JPG or PNG', 400);
    }

    const pages = pdfDoc.getPages();
    const pageIdx = parseInt(pageIndex);
    
    if (pageIdx < 0 || pageIdx >= pages.length) {
        throw new PDFProcessingError('Invalid page index', 400);
    }

    const page = pages[pageIdx];
    
    // Default dimensions if not provided or invalid
    const imgDims = signatureImage.scale(0.5); // Default scale
    const sigWidth = parseFloat(width) || imgDims.width;
    const sigHeight = parseFloat(height) || imgDims.height;
    const sigX = parseFloat(x) || 100;
    const sigY = parseFloat(y) || 100;

    page.drawImage(signatureImage, {
      x: sigX,
      y: sigY,
      width: sigWidth,
      height: sigHeight,
    });

    const newPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="signed.pdf"');
    res.send(Buffer.from(newPdfBytes));

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error signing PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to sign PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
