const express = require("express");
const multer = require("multer");
const { fromPath } = require("pdf2pic");
const { createWorker } = require("tesseract.js");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Sentry = require("@sentry/node");

const router = express.Router();

// Configure multer with file validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Custom error class for better error handling
class PDFProcessingError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "PDFProcessingError";
  }
}

// Helper function to delete temp files
const deleteTempFiles = (files) => {
  files.forEach((file) => {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

// OCR PDF endpoint
router.post("/", upload.single("pdf"), async (req, res) => {
  let tempPdfPath = null;
  let worker = null;
  let clientDisconnected = false;

  // Handle client disconnect
  req.on("close", () => {
    clientDisconnected = true;
    console.log("Client disconnected during OCR processing");
  });

  try {
    if (!req.file) {
      throw new PDFProcessingError("PDF file is required", 400);
    }

    if (req.file.size > 50 * 1024 * 1024) {
      throw new PDFProcessingError("File size exceeds 50MB limit", 413);
    }

    // Write PDF buffer to temp file for pdf2pic
    tempPdfPath = path.join(__dirname, `temp-${uuidv4()}.pdf`);
    fs.writeFileSync(tempPdfPath, req.file.buffer);

    // Configure pdf2pic to convert PDF to images
    const options = {
      density: 300,
      saveFilename: "page",
      savePath: path.dirname(tempPdfPath),
      format: "jpeg",
      width: 2000,
      height: 2000,
    };

    const convert = fromPath(tempPdfPath, options);
    const results = await convert.bulk(-1); // Convert all pages

    if (clientDisconnected) {
      console.log("Aborting OCR - client disconnected");
      return;
    }

    // Initialize Tesseract worker
    worker = await createWorker("eng");

    let fullText = "";
    for (const result of results) {
      if (clientDisconnected) {
        console.log("Aborting OCR - client disconnected during processing");
        break;
      }

      if (result.buffer) {
        const {
          data: { text },
        } = await worker.recognize(result.buffer);
        fullText += text + "\n";
      }
    }

    if (clientDisconnected) {
      return;
    }

    // Set response headers for text download
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", 'attachment; filename="ocr.txt"');
    res.send(fullText);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error performing OCR on PDF:", error);
    const statusCode = error.statusCode || 500;

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(statusCode).json({
        error: error.message || "Failed to perform OCR on PDF",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    } else {
      res.end();
    }
  } finally {
    // Clean up temp files
    if (tempPdfPath && fs.existsSync(tempPdfPath)) {
      try {
        fs.unlinkSync(tempPdfPath);
      } catch (e) {
        console.error("Error cleaning up temp PDF:", e.message);
      }
    }
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        console.error("Error terminating worker:", e.message);
      }
    }
  }
});

module.exports = router;
