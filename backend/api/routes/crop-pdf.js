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

    const { x = 0, y = 0, width, height } = req.body;
    
    const cropX = parseFloat(x);
    const cropY = parseFloat(y);
    const cropWidth = parseFloat(width);
    const cropHeight = parseFloat(height);

    if (isNaN(cropWidth) || isNaN(cropHeight) || cropWidth <= 0 || cropHeight <= 0) {
        throw new PDFProcessingError('Valid width and height are required for cropping', 400);
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      // pdf-lib setCropBox origin is bottom-left?
      // "The crop box defines the region to which the contents of the page are to be clipped (cropped) when displayed or printed."
      // The coordinates are in user space units.
      
      // Assuming x, y come from top-left (web standard) or bottom-left (pdf standard).
      // Let's assume standard PDF coordinates (bottom-left origin) for simplicity unless specified.
      // But web UI usually uses top-left.
      // If UI sends top-left X/Y, we might need to flip Y.
      // Let's assume the user sends standard PDF coordinates or we document it.
      // For this implementation, we'll apply the crop box directly.
      
      page.setCropBox(cropX, cropY, cropWidth, cropHeight);
      page.setMediaBox(cropX, cropY, cropWidth, cropHeight);
    });

    const newPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cropped.pdf"');
    res.send(Buffer.from(newPdfBytes));

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error cropping PDF:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to crop PDF',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
