const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sentry = require('@sentry/node');
const os = require('os');
const util = require('util');

const execPromise = util.promisify(exec);
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

// Check if Ghostscript is available
const checkGhostscript = async () => {
  try {
    await execPromise('gs --version');
    return true;
  } catch (e) {
    try {
        await execPromise('gswin64c --version'); // Windows check
        return 'gswin64c';
    } catch (e2) {
        return false;
    }
  }
};

router.post('/', upload.single('pdf'), async (req, res) => {
  let tempFilePath = null;
  let outputFilePath = null;
  let outputDir = null;

  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    const gsCommand = await checkGhostscript();
    if (!gsCommand) {
      throw new PDFProcessingError('PDF/A conversion is not supported in this environment (Ghostscript missing)', 501);
    }
    
    const cmd = gsCommand === true ? 'gs' : gsCommand;

    const jobId = uuidv4();
    const tempDir = os.tmpdir();
    outputDir = path.join(tempDir, `pdf-to-pdfa-${jobId}`);
    await fs.ensureDir(outputDir);

    tempFilePath = path.join(outputDir, 'input.pdf');
    outputFilePath = path.join(outputDir, 'output.pdf');
    await fs.writeFile(tempFilePath, req.file.buffer);

    // PDF/A-1b conversion command
    // Note: robust PDF/A conversion usually requires a PDFA_def.ps file with color profile path.
    // For this implementation, we try a standard command that attempts to convert.
    // Ideally we should include a PDFA_def.ps and an ICC profile in the project.
    
    const command = `"${cmd}" -dPDFA -dBATCH -dNOPAUSE -sColorConversionStrategy=UseDeviceIndependentColor -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=1 -sOutputFile="${outputFilePath}" "${tempFilePath}"`;

    await execPromise(command);

    if (!await fs.pathExists(outputFilePath)) {
      throw new PDFProcessingError('Ghostscript failed to generate output file', 500);
    }

    const pdfBytes = await fs.readFile(outputFilePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted-pdfa.pdf"');
    res.send(pdfBytes);

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting PDF to PDF/A:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to convert PDF to PDF/A',
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
