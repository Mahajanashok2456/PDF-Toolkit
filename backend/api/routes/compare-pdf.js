const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { diffLines } = require('diff');
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

router.post('/', upload.fields([{ name: 'pdf1', maxCount: 1 }, { name: 'pdf2', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.pdf1 || !req.files.pdf1[0] || !req.files.pdf2 || !req.files.pdf2[0]) {
      throw new PDFProcessingError('Two PDF files are required for comparison', 400);
    }

    const buffer1 = req.files.pdf1[0].buffer;
    const buffer2 = req.files.pdf2[0].buffer;

    const data1 = await pdfParse(buffer1);
    const data2 = await pdfParse(buffer2);

    const text1 = data1.text;
    const text2 = data2.text;

    const diff = diffLines(text1, text2);
    
    // Process diff to make it more consumable
    const summary = diff.map(part => ({
        added: part.added,
        removed: part.removed,
        value: part.value,
        count: part.count
    }));

    res.json({
        metadata: {
            pdf1: {
                pages: data1.numpages,
                info: data1.info
            },
            pdf2: {
                pages: data2.numpages,
                info: data2.info
            }
        },
        diff: summary
    });

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error comparing PDFs:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to compare PDFs',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
