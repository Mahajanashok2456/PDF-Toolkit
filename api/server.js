const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");

const app = express();

// Basic middleware
app.use(express.json({ limit: "50mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Merge PDFs
app.post("/api/merge", upload.array("pdfs", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "At least 2 PDF files required" });
    }

    const mergedPdf = await PDFDocument.create();
    
    for (const file of req.files) {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="merged.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: "Failed to merge PDFs" });
  }
});

// Split PDF
app.post("/api/split", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file required" });
    }

    const { startPage = 1, endPage } = req.body;
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    
    const newPdf = await PDFDocument.create();
    const start = parseInt(startPage) - 1;
    const end = endPage ? parseInt(endPage) - 1 : totalPages - 1;
    
    const pages = await newPdf.copyPages(pdfDoc, Array.from({length: end - start + 1}, (_, i) => start + i));
    pages.forEach(page => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="split.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: "Failed to split PDF" });
  }
});

// Disabled routes - now handled by separate functions
const disabledRoutes = [
  "jpg-to-pdf", "word-to-pdf"
];

disabledRoutes.forEach(route => {
  app.post(`/api/${route}`, (req, res) => {
    res.status(503).json({ 
      error: `${route} temporarily unavailable to reduce bundle size` 
    });
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;