const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const Sentry = require('@sentry/node');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Conversion endpoint
router.post('/', upload.single('pdf'), async (req, res) => {
  // In Production (Vercel), requests are routed to api/pdf_to_word_python.py via vercel.json rewrites.
  // This JS handler is only used for LOCAL development or as a fallback.
  
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: "Routing error: This request should have been handled by the Python worker." });
  }

  let tempPdfPath = null;
  let tempDocxPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const uniqueId = uuidv4();
    const tempDir = path.join(__dirname, '../temp');
    await fs.ensureDir(tempDir);
    
    tempPdfPath = path.join(tempDir, `input-${uniqueId}.pdf`);
    tempDocxPath = path.join(tempDir, `output-${uniqueId}.docx`);
    
    await fs.writeFile(tempPdfPath, req.file.buffer);

    // Call the high-fidelity Python script locally
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../scripts/pdf_to_word.py'),
      tempPdfPath,
      tempDocxPath
    ]);

    await new Promise((resolve, reject) => {
      let stderr = '';
      pythonProcess.stderr.on('data', (data) => stderr += data.toString());
      pythonProcess.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Python conversion failed: ${stderr}`));
      });
    });

    const docxBuffer = await fs.readFile(tempDocxPath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
    res.send(docxBuffer);

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error during local PDF to Word conversion:', error);
    res.status(500).json({ error: error.message || 'Failed to convert PDF to Word locally' });
  } finally {
    try {
      if (tempPdfPath) await fs.remove(tempPdfPath);
      if (tempDocxPath) await fs.remove(tempDocxPath);
    } catch (e) {}
  }
});

module.exports = router;