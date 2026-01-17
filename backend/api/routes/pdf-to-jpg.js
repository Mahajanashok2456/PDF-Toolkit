const express = require("express");
const multer = require("multer");
const { fromPath } = require("pdf2pic");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Sentry = require("@sentry/node");
const os = require("os");
const archiver = require("archiver");

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
  let tempFilePath = null;
  let outputDir = null;
  let clientDisconnected = false;
  let processingComplete = false;

  // Handle client disconnect - only during processing
  req.on("close", () => {
    if (!processingComplete) {
      clientDisconnected = true;
      console.log("Client disconnected during PDF to JPG conversion");
    }
  });

  try {
    if (!req.file) {
      throw new PDFProcessingError("PDF file is required", 400);
    }

    const jobId = uuidv4();
    const tempDir = os.tmpdir();
    outputDir = path.join(tempDir, `pdf-to-jpg-${jobId}`);
    await fs.ensureDir(outputDir);

    tempFilePath = path.join(outputDir, "input.pdf");
    await fs.writeFile(tempFilePath, req.file.buffer);

    const options = {
      density: 100,
      saveFilename: "page",
      savePath: outputDir,
      format: "jpg",
      width: 1240, // A4 at 150dpi approx, or just reasonable web size
      height: 1754,
    };

    const convert = fromPath(tempFilePath, options);

    // Convert all pages
    // pdf2pic convert bulk returns array of results
    const results = await convert.bulk(-1, { responseType: "image" });

    if (clientDisconnected) {
      console.log("Aborting PDF to JPG - client disconnected");
      return;
    }

    if (!results || results.length === 0) {
      throw new PDFProcessingError("Failed to convert PDF to images", 500);
    }

    // Check if we have one or multiple images
    const files = await fs.readdir(outputDir);
    const jpgFiles = files.filter(
      (f) => f.endsWith(".jpg") || f.endsWith(".jpeg"),
    );

    if (jpgFiles.length === 0) {
      throw new PDFProcessingError("No images generated", 500);
    }

    if (clientDisconnected) {
      console.log(
        "Aborting PDF to JPG - client disconnected before sending files",
      );
      return;
    }

    if (jpgFiles.length === 1) {
      // Return single image
      const imagePath = path.join(outputDir, jpgFiles[0]);
      const imageBuffer = await fs.readFile(imagePath);

      if (clientDisconnected) {
        console.log("Aborting PDF to JPG - client disconnected");
        return;
      }

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="converted.jpg"',
      );
      processingComplete = true;
      res.send(imageBuffer);
    } else {
      // Return ZIP
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="converted-images.zip"',
      );

      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("error", (err) => {
        if (clientDisconnected) {
          console.log("Archive error (client disconnected):", err.message);
        } else {
          throw err;
        }
      });

      archive.pipe(res);

      for (const file of jpgFiles) {
        if (clientDisconnected) {
          console.log("Aborting ZIP - client disconnected");
          archive.abort();
          return;
        }
        archive.file(path.join(outputDir, file), { name: file });
      }

      try {
        processingComplete = true;
        await archive.finalize();
      } catch (archiveError) {
        if (clientDisconnected) {
          console.log(
            "Archive finalize failed (client disconnected):",
            archiveError.message,
          );
          return;
        }
        throw archiveError;
      }
    }
  } catch (error) {
    // Ignore write errors if client disconnected
    if (
      clientDisconnected &&
      (error.code === "EOF" ||
        error.code === "EPIPE" ||
        error.syscall === "write")
    ) {
      console.log("Suppressing write error - client already disconnected");
      return;
    }

    Sentry.captureException(error);
    console.error("Error converting PDF to JPG:", error);
    const statusCode = error.statusCode || 500;

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(statusCode).json({
        error: error.message || "Failed to convert PDF to JPG",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    } else {
      res.end();
    }
  } finally {
    // Cleanup
    if (outputDir) {
      try {
        await fs.remove(outputDir);
      } catch (e) {
        console.error("Error cleaning up temp files:", e);
      }
    }
  }
});

module.exports = router;
