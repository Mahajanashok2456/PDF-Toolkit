const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Sentry = require("@sentry/node");
const os = require("os");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for Office files
  fileFilter: (req, file, cb) => {
    const validMimes = [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/x-mspowerpoint",
    ];
    const validExts = [".ppt", ".pptx"];

    const isValid =
      validMimes.includes(file.mimetype) ||
      validExts.includes(path.extname(file.originalname).toLowerCase());

    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("Only PowerPoint files (.ppt, .pptx) are allowed"), false);
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

// Helper to spawn LibreOffice conversion
const convertWithLibreOffice = (inputPath, outputDir) => {
  return new Promise((resolve, reject) => {
    // Use soffice (LibreOffice CLI) to convert to PDF
    const proc = spawn("soffice", [
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      outputDir,
      inputPath,
    ]);

    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        // Get the output PDF name (LibreOffice replaces extension with .pdf)
        const outputFileName =
          path.basename(inputPath, path.extname(inputPath)) + ".pdf";
        const outputPath = path.join(outputDir, outputFileName);

        // Verify output exists
        fs.pathExists(outputPath)
          .then((exists) => {
            if (exists) {
              resolve(outputPath);
            } else {
              reject(new Error("LibreOffice did not generate PDF output"));
            }
          })
          .catch(reject);
      } else {
        reject(
          new Error(
            `LibreOffice conversion failed (code ${code}): ${stderr || "Unknown error"}`,
          ),
        );
      }
    });

    proc.on("error", (err) => {
      reject(
        new Error(
          `Failed to launch LibreOffice. Ensure LibreOffice is installed: ${err.message}`,
        ),
      );
    });
  });
};

router.post("/", upload.single("file"), async (req, res) => {
  let tempDir = null;
  let inputPath = null;

  try {
    if (!req.file) {
      throw new PDFProcessingError("PowerPoint file is required", 400);
    }

    const jobId = uuidv4();
    tempDir = path.join(os.tmpdir(), `pptx-to-pdf-${jobId}`);
    await fs.ensureDir(tempDir);

    // Write uploaded file to disk
    inputPath = path.join(
      tempDir,
      `input${path.extname(req.file.originalname)}`,
    );
    await fs.writeFile(inputPath, req.file.buffer);

    // Convert using LibreOffice
    const outputPdfPath = await convertWithLibreOffice(inputPath, tempDir);
    const pdfBuffer = await fs.readFile(outputPdfPath);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="converted.pdf"',
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error converting PowerPoint to PDF:", error);
    const statusCode = error.statusCode || 500;

    if (!res.headersSent) {
      res.status(statusCode).json({
        error: error.message || "Failed to convert PowerPoint to PDF",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    } else {
      res.end();
    }
  } finally {
    // Cleanup temp directory
    if (tempDir) {
      try {
        await fs.remove(tempDir);
      } catch (e) {
        console.error("Error cleaning up temp files:", e.message);
      }
    }
  }
});

module.exports = router;
