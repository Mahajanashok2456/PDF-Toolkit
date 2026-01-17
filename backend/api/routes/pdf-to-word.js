const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sentry = require('@sentry/node');
const { Document, Paragraph, Packer, TextRun } = require('docx');

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

// Convert PDF to Word endpoint
const { spawn } = require('child_process');

// Convert PDF to Word endpoint
router.post('/', upload.single('pdf'), async (req, res) => {
  let tempPdfPath = null;
  let tempDocxPath = null;

  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    if (req.file.size > 50 * 1024 * 1024) {
      throw new PDFProcessingError('File size exceeds 50MB limit', 413);
    }

    // Create unique temp paths
    const uniqueId = uuidv4();
    tempPdfPath = path.join(__dirname, `../temp/input-${uniqueId}.pdf`);
    tempDocxPath = path.join(__dirname, `../temp/output-${uniqueId}.docx`);
    
    // Ensure temp dir exists
    await fs.ensureDir(path.dirname(tempPdfPath));

    // Write buffer to disk so Python can read it
    await fs.writeFile(tempPdfPath, req.file.buffer);

    // Spawn Python process
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../scripts/pdf_to_word.py'),
      tempPdfPath,
      tempDocxPath
    ]);

    // Handle process events
    await new Promise((resolve, reject) => {
      let stderrData = '';

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Conversion failed (Exit code ${code}): ${stderrData}`));
        }
      });

      pythonProcess.on('error', (err) => {
        reject(new Error(`Failed to start conversion process: ${err.message}`));
      });
    });

    // Check if output file exists
    if (!await fs.pathExists(tempDocxPath)) {
      throw new Error('Output file was not created by conversion script');
    }

    // Read generated file
    const docxBuffer = await fs.readFile(tempDocxPath);

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
    res.send(docxBuffer);

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting PDF to Word:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to convert PDF to Word',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    // Cleanup files
    try {
      if (tempPdfPath && await fs.pathExists(tempPdfPath)) {
        await fs.unlink(tempPdfPath);
      }
      if (tempDocxPath && await fs.pathExists(tempDocxPath)) {
        await fs.unlink(tempDocxPath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temp files:', cleanupError);
    }
  }
});

module.exports = router;