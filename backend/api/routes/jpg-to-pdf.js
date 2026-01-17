const express = require("express");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const sharp = require("sharp");
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
    // Defer validation to processing step; accept and validate with sharp later
    cb(null, true);
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

// Convert JPG to PDF endpoint - handles multiple images
router.post("/", upload.array("file", 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new PDFProcessingError("At least one image file is required", 400);
    }

    // Filter out invalid images first before processing
    const validImages = [];

    for (const file of req.files) {
      try {
        // Check file size
        if (file.size > 50 * 1024 * 1024) {
          console.warn(`Skipping ${file.originalname} - exceeds 50MB limit`);
          continue;
        }

        // Validate it's a real image
        const imageMetadata = await sharp(file.buffer).metadata();
        if (!imageMetadata || !imageMetadata.width || !imageMetadata.height) {
          console.warn(
            `Skipping ${file.originalname} - invalid image metadata`,
          );
          continue;
        }

        validImages.push({
          buffer: file.buffer,
          metadata: imageMetadata,
          name: file.originalname,
        });
      } catch (error) {
        console.warn(
          `Skipping invalid image ${file.originalname}:`,
          error.message,
        );
        continue;
      }
    }

    if (validImages.length === 0) {
      throw new PDFProcessingError("No valid images could be processed", 400);
    }

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="converted.pdf"',
    );

    // Create PDF without an automatic first page and pipe before writing
    const doc = new PDFDocument({ autoFirstPage: false });
    doc.pipe(res);

    // Optimization settings (can be tuned via env vars)
    const MAX_DIM = parseInt(process.env.JPG_TO_PDF_MAX_DIM || "2000", 10); // max width/height in pixels
    const JPEG_QUALITY = parseInt(process.env.JPG_TO_PDF_QUALITY || "70", 10); // 1-100

    // Add each image on its own page after resizing and recompressing
    for (const image of validImages) {
      try {
        // Resize to fit within MAX_DIM and recompress as JPEG to shrink size
        const processedBuffer = await sharp(image.buffer)
          .rotate() // respect orientation metadata
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
      } catch (imgErr) {
        console.warn(
          "Failed to optimize image; embedding original:",
          image.name,
          imgErr?.message,
        );
        const { width, height } = image.metadata;
        doc.addPage({ size: [width, height] });
        doc.image(image.buffer, 0, 0, { width, height });
      }
    }

    // End the document stream
    doc.end();
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error converting JPG to PDF:", error);
    const statusCode = error.statusCode || 500;

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(statusCode).json({
        error: error.message || "Failed to convert JPG to PDF",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    } else {
      // If headers already sent, just end the response
      res.end();
    }
  }
});

module.exports = router;
