const express = require('express');
const multer = require('multer');
const { fromPath } = require('pdf2pic');
const pptxgen = require('pptxgenjs');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sentry = require('@sentry/node');
const os = require('os');

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
  let tempFilePath = null;
  let outputDir = null;

  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    const jobId = uuidv4();
    const tempDir = os.tmpdir();
    outputDir = path.join(tempDir, `pdf-to-ppt-${jobId}`);
    await fs.ensureDir(outputDir);

    tempFilePath = path.join(outputDir, 'input.pdf');
    await fs.writeFile(tempFilePath, req.file.buffer);

    // 1. Convert to Images
    const options = {
      density: 150, // Higher density for better quality in PPT
      saveFilename: "page",
      savePath: outputDir,
      format: "png", // PNG better for text sharpness
      width: 1920, 
      height: 1080 
    };

    const convert = fromPath(tempFilePath, options);
    const results = await convert.bulk(-1, { responseType: "image" });

    if (!results || results.length === 0) {
      throw new PDFProcessingError('Failed to convert PDF pages', 500);
    }

    // 2. Create PPT
    const pres = new pptxgen();
    
    // Sort images by page number
    const files = await fs.readdir(outputDir);
    const imageFiles = files
        .filter(f => f.endsWith('.png'))
        .sort((a, b) => {
            // Extract number from filename (page.1.png vs page.10.png)
            const numA = parseInt(a.match(/(\d+)/)[0]);
            const numB = parseInt(b.match(/(\d+)/)[0]);
            return numA - numB;
        });

    if (imageFiles.length === 0) {
        throw new PDFProcessingError('No images generated', 500);
    }

    for (const imgFile of imageFiles) {
        const slide = pres.addSlide();
        const imgPath = path.join(outputDir, imgFile);
        
        // Add image to slide, fitting to slide
        slide.addImage({ 
            path: imgPath, 
            x: 0, 
            y: 0, 
            w: '100%', 
            h: '100%' 
        });
    }

    const pptBuffer = await pres.write({ outputType: 'nodebuffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pptx"');
    res.send(pptBuffer);

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting PDF to PowerPoint:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to convert PDF to PowerPoint',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (outputDir) {
      try {
        await fs.remove(outputDir);
      } catch (e) {
        // ignore
      }
    }
  }
});

module.exports = router;
