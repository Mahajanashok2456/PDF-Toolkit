const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFDocument, degrees } = require("pdf-lib");
const PDFKitDocument = require("pdfkit");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const originPatterns = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const escapeRegex = (str) => str.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
const isOriginAllowed = (origin) => {
  if (!origin) return true;
  return originPatterns.some((pattern) => {
    if (pattern === "*") return true;
    if (pattern.includes("*")) {
      const regex = new RegExp(
        "^" + escapeRegex(pattern).replace(/\\\*/g, ".*") + "$",
      );
      return regex.test(origin);
    }
    return pattern === origin;
  });
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed for this origin"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json({ limit: "50mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const connectDB = async () => {
  if (!process.env.MONGODB_URI) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.warn(
      "Mongo connection failed (continuing without DB)",
      err.message,
    );
  }
};
connectDB();

const RatingSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, trim: true, maxlength: 200 },
    tool: { type: String, default: "general" },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "ratings" },
);
const Rating = mongoose.models.Rating || mongoose.model("Rating", RatingSchema);

app.get("/", (req, res) => {
  res.json({ status: "PDF Toolkit Backend API", version: "1.1.0" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/api/merge", upload.array("pdfs", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "At least 2 PDF files required" });
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of req.files) {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="merged.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Merge error:", error);
    res.status(500).json({ error: "Failed to merge PDFs" });
  }
});

app.post("/api/split", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    const { startPage = 1, endPage } = req.body;
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();

    const newPdf = await PDFDocument.create();
    const start = Math.max(0, parseInt(startPage, 10) - 1);
    const end = endPage
      ? Math.min(totalPages - 1, parseInt(endPage, 10) - 1)
      : totalPages - 1;
    const indices = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i,
    );

    const pages = await newPdf.copyPages(pdfDoc, indices);
    pages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="split.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Split error:", error);
    res.status(500).json({ error: "Failed to split PDF" });
  }
});

app.post("/api/rotate", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    const { angle } = req.body;
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();

    const rotation = degrees(parseInt(angle, 10));
    pages.forEach((page) => page.setRotation(rotation));

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="rotated.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Rotate error:", error);
    res.status(500).json({ error: "Failed to rotate PDF" });
  }
});

app.post("/api/remove-pages", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    let { pagesToRemove } = req.body;
    if (typeof pagesToRemove === "string") {
      try {
        pagesToRemove = JSON.parse(pagesToRemove);
      } catch (e) {}
    }

    if (!Array.isArray(pagesToRemove) || pagesToRemove.length === 0) {
      return res
        .status(400)
        .json({ error: "Pages to remove must be an array" });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const invalid = pagesToRemove.filter((p) => p < 1 || p > totalPages);
    if (invalid.length) {
      return res
        .status(400)
        .json({ error: `Invalid page numbers: ${invalid.join(", ")}` });
    }

    const keep = [];
    for (let i = 0; i < totalPages; i += 1) {
      if (!pagesToRemove.includes(i + 1)) keep.push(i);
    }
    if (!keep.length)
      return res.status(400).json({ error: "Cannot remove all pages" });

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdfDoc, keep);
    pages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="removed-pages.pdf"',
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Remove pages error:", error);
    res.status(500).json({ error: "Failed to remove pages" });
  }
});

app.post("/api/extract-pages", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    let { pagesToExtract } = req.body;
    if (typeof pagesToExtract === "string") {
      try {
        pagesToExtract = JSON.parse(pagesToExtract);
      } catch (e) {}
    }

    if (!Array.isArray(pagesToExtract) || pagesToExtract.length === 0) {
      return res
        .status(400)
        .json({ error: "Pages to extract must be an array" });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const invalid = pagesToExtract.filter((p) => p < 1 || p > totalPages);
    if (invalid.length) {
      return res
        .status(400)
        .json({ error: `Invalid page numbers: ${invalid.join(", ")}` });
    }

    const indices = pagesToExtract.map((p) => p - 1).sort((a, b) => a - b);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdfDoc, indices);
    pages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="extracted-pages.pdf"',
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Extract pages error:", error);
    res.status(500).json({ error: "Failed to extract pages" });
  }
});

app.post("/api/organize-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    let { newOrder } = req.body;
    if (typeof newOrder === "string") {
      try {
        newOrder = JSON.parse(newOrder);
      } catch (e) {}
    }

    if (!Array.isArray(newOrder) || newOrder.length === 0) {
      return res.status(400).json({ error: "New order must be an array" });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const invalid = newOrder.filter((p) => p < 1 || p > totalPages);
    if (invalid.length) {
      return res
        .status(400)
        .json({ error: `Invalid page numbers: ${invalid.join(", ")}` });
    }

    const target = newOrder.map((p) => p - 1);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdfDoc, target);
    pages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="organized.pdf"',
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Organize error:", error);
    res.status(500).json({ error: "Failed to organize PDF" });
  }
});

app.post("/api/protect-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });
    const { password } = req.body;
    if (!password || password.length < 1) {
      return res.status(400).json({ error: "Password is required" });
    }

    const { promisify } = require("util");
    const execAsync = promisify(exec);

    try {
      await execAsync("qpdf --version");
    } catch {
      return res.status(503).json({
        error: "Under process , Thankyou for using our services",
        details:
          "This feature requires the qpdf system binary which is only available on paid Render plans.",
      });
    }

    const tempDir = path.join(__dirname, "temp");
    const inputPath = path.join(tempDir, `input-${uuidv4()}.pdf`);
    const outputPath = path.join(tempDir, `output-${uuidv4()}.pdf`);

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(inputPath, req.file.buffer);

    const cmd = `qpdf --encrypt "${password}" "${password}" 256 -- "${inputPath}" "${outputPath}"`;
    await execAsync(cmd);

    const encrypted = fs.readFileSync(outputPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="protected.pdf"',
    );
    res.send(encrypted);
  } catch (error) {
    console.error("Protect error:", error);
    res.status(500).json({ error: error.message || "Failed to protect PDF" });
  }
});

app.post("/api/jpg-to-pdf", upload.array("file", 50), async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res
        .status(400)
        .json({ error: "At least one image file is required" });
    }

    const validImages = [];
    for (const file of req.files) {
      try {
        if (file.size > 50 * 1024 * 1024) continue;
        const meta = await sharp(file.buffer).metadata();
        if (!meta || !meta.width || !meta.height) continue;
        validImages.push({
          buffer: file.buffer,
          metadata: meta,
          name: file.originalname,
        });
      } catch (err) {
        console.warn("Skipping invalid image", file.originalname, err.message);
      }
    }

    if (!validImages.length) {
      return res
        .status(400)
        .json({ error: "No valid images could be processed" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="converted.pdf"',
    );

    const doc = new PDFKitDocument({ autoFirstPage: false });
    doc.pipe(res);

    const MAX_DIM = parseInt(process.env.JPG_TO_PDF_MAX_DIM || "2000", 10);
    const JPEG_QUALITY = parseInt(process.env.JPG_TO_PDF_QUALITY || "70", 10);

    for (const image of validImages) {
      try {
        const processedBuffer = await sharp(image.buffer)
          .rotate()
          .resize({
            width: MAX_DIM,
            height: MAX_DIM,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toBuffer();

        const processedMeta = await sharp(processedBuffer).metadata();
        const w = processedMeta.width || image.metadata.width;
        const h = processedMeta.height || image.metadata.height;

        doc.addPage({ size: [w, h] });
        doc.image(processedBuffer, 0, 0, { width: w, height: h });
      } catch (err) {
        const { width, height } = image.metadata;
        doc.addPage({ size: [width, height] });
        doc.image(image.buffer, 0, 0, { width, height });
      }
    }

    doc.end();
  } catch (error) {
    console.error("JPG to PDF error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to convert JPG to PDF" });
    }
  }
});

app.post("/api/ratings", async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ error: "Ratings unavailable" });
    }
    const { rating, feedback, tool } = req.body || {};
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating (1-5 required)" });
    }
    await Rating.create({ rating, feedback, tool: tool || "general" });
    res.status(201).json({ message: "Rating submitted" });
  } catch (error) {
    console.error("Ratings error:", error);
    res.status(500).json({ error: "Failed to save rating" });
  }
});

app.get("/api/ratings/stats", async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.json({ ratingValue: 5.0, ratingCount: 0, note: "Offline" });
    }
    const stats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);
    if (!stats.length) return res.json({ ratingValue: 0, ratingCount: 0 });
    res.json({
      ratingValue: parseFloat(stats[0].averageRating.toFixed(1)),
      ratingCount: stats[0].totalRatings,
    });
  } catch (error) {
    console.error("Ratings stats error:", error);
    res.status(500).json({ error: "Failed to fetch rating stats" });
  }
});

app.post("/api/pdf-to-word", upload.single("pdf"), async (req, res) => {
  const tempDir = path.join(__dirname, "temp");
  const inputPath = path.join(tempDir, `input-${uuidv4()}.pdf`);
  const outputPath = path.join(tempDir, `output-${uuidv4()}.docx`);

  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(inputPath, req.file.buffer);

    const { promisify } = require("util");
    const execAsync = promisify(exec);

    try {
      const pythonScript = `
import sys
try:
  from pdf2docx import convert
  convert('${inputPath}', '${outputPath}')
  print('SUCCESS')
except Exception as e:
  print(f'ERROR: {str(e)}')
  sys.exit(1)
`;
      const result = await execAsync(
        `python -c "${pythonScript.replace(/"/g, '\\"')}"`,
      );
      if (result.stdout.includes("SUCCESS")) {
        if (!fs.existsSync(outputPath))
          throw new Error("Output file not created");
        const docx = fs.readFileSync(outputPath);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="converted.docx"',
        );
        return res.send(docx);
      }
    } catch (pythonErr) {
      console.warn("Python pdf2docx not available:", pythonErr.message);
    }

    return res.status(503).json({
      error: "Under process , Thankyou for using our services",
      details:
        "This feature requires Python with pdf2docx library. Not available on Render free tier. Upgrade to Starter ($7/month) or use a dedicated conversion service.",
    });
  } catch (error) {
    console.error("PDF to Word error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to convert PDF to Word" });
  } finally {
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
  }
});

app.post("/api/word-to-pdf", upload.single("docx"), async (req, res) => {
  console.log(
    `[word-to-pdf] Received request, file:`,
    req.file ? `${req.file.originalname} (${req.file.size} bytes)` : "NO FILE",
  );
  const tempDir = path.join(__dirname, "temp");
  const inputPath = path.join(tempDir, `input-${uuidv4()}.docx`);
  const outputPath = path.join(tempDir, `output-${uuidv4()}.pdf`);

  try {
    if (!req.file)
      return res.status(400).json({ error: "Word file (.docx) required" });

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(inputPath, req.file.buffer);

    const { promisify } = require("util");
    const execAsync = promisify(exec);

    try {
      const cmd = `libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${inputPath}"`;
      await execAsync(cmd);
      if (fs.existsSync(outputPath)) {
        const pdf = fs.readFileSync(outputPath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="converted.pdf"',
        );
        return res.send(pdf);
      }
    } catch (libreofficeErr) {
      console.warn("LibreOffice not available:", libreofficeErr.message);
    }

    return res.status(503).json({
      error: "Under process , Thankyou for using our services",
      details:
        "This feature requires LibreOffice or pandoc. Not available on Render free tier. Upgrade to Starter ($7/month) for LibreOffice support.",
    });
  } catch (error) {
    console.error("Word to PDF error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to convert Word to PDF" });
  } finally {
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error(
      `Multer Error on ${req.path}:`,
      err.code,
      err.field,
      err.message,
    );
    if (err.code === "UNEXPECTED_FILE") {
      return res.status(400).json({
        error: `Unexpected field "${err.field}". Expected file field for this endpoint.`,
      });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    console.error(`Error on ${req.path}:`, err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
  next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app;
