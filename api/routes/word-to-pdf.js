const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const Sentry = require('@sentry/node');
const { getBrowser } = require("../utils/browserLauncher");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/', upload.single('file'), async (req, res) => {
  let browser;
  try {
    if (!req.file) return res.status(400).json({ error: "File required" });

    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="padding:40px; font-family:sans-serif;">${result.value}</body></html>`;

    browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setContent(html, { 
      waitUntil: "load", 
      timeout: 30000 
    });

    await new Promise(r => setTimeout(r, 500));

    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    console.log(`Generated Word-PDF. Size: ${pdfBuffer.length} bytes`);

    if (pdfBuffer.length < 100) {
      throw new Error("Invalid PDF generated (file too small).");
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Conversion Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Failed to convert Word to PDF." });
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
  }
});

module.exports = router;
