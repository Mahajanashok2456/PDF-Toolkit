const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Sentry = require("@sentry/node");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

class PDFProcessingError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "PDFProcessingError";
  }
}

router.post("/", upload.single("pdf"), async (req, res) => {
  const tempDir = path.join(__dirname, "../../temp");
  const inputPath = path.join(tempDir, `input-${uuidv4()}.pdf`);
  const outputPath = path.join(tempDir, `output-${uuidv4()}.pdf`);

  try {
    if (!req.file) {
      throw new PDFProcessingError("PDF file is required", 400);
    }

    const { password } = req.body;

    if (!password || password.length < 1) {
      throw new PDFProcessingError("Password is required", 400);
    }

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write input file
    fs.writeFileSync(inputPath, req.file.buffer);

    // Try to use qpdf for encryption
    const qpdfCommand = `qpdf --encrypt "${password}" "${password}" 256 -- "${inputPath}" "${outputPath}"`;

    await new Promise((resolve, reject) => {
      exec(qpdfCommand, (error, stdout, stderr) => {
        if (error) {
          // Check if qpdf is not installed
          if (
            error.message.includes("not recognized") ||
            error.message.includes("command not found")
          ) {
            reject(
              new PDFProcessingError(
                "PDF encryption requires qpdf to be installed. Please install qpdf: Windows: 'choco install qpdf' or download from https://github.com/qpdf/qpdf/releases",
                501,
              ),
            );
          } else {
            reject(
              new PDFProcessingError(
                `Encryption failed: ${error.message}`,
                500,
              ),
            );
          }
        } else {
          resolve();
        }
      });
    });

    // Read encrypted file
    const encryptedBuffer = fs.readFileSync(outputPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="protected.pdf"',
    );
    res.send(encryptedBuffer);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error protecting PDF:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || "Failed to protect PDF",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  } finally {
    // Clean up temp files
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch (cleanupError) {
      console.error("Error cleaning up temp files:", cleanupError);
    }
  }
});

module.exports = router;
