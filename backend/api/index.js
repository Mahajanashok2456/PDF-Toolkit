const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const Sentry = require("@sentry/node");

// Import route handlers
const mergeRoutes = require("./routes/merge");
const splitRoutes = require("./routes/split");
const convertRoutes = require("./routes/convert");
const pdfToWordRoutes = require("./routes/pdf-to-word");
const rotateRoutes = require("./routes/rotate");
const removePagesRoutes = require("./routes/remove-pages");
const extractPagesRoutes = require("./routes/extract-pages");
const organizePdfRoutes = require("./routes/organize-pdf");
const jpgToPdfRoutes = require("./routes/jpg-to-pdf");
const wordToPdfRoutes = require("./routes/word-to-pdf");
const htmlToPdfRoutes = require("./routes/html-to-pdf");
const protectPdfRoutes = require("./routes/protect-pdf");

const app = express();

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Temporary directory for file processing
const tempDir = path.join(__dirname, "temp");
fs.ensureDirSync(tempDir);

// Routes
app.use("/api/merge", mergeRoutes);
app.use("/api/split", splitRoutes);
app.use("/api/convert", convertRoutes);
app.use("/api/pdf-to-word", pdfToWordRoutes);
app.use("/api/rotate", rotateRoutes);
app.use("/api/remove-pages", removePagesRoutes);
app.use("/api/extract-pages", extractPagesRoutes);
app.use("/api/organize-pdf", organizePdfRoutes);
app.use("/api/jpg-to-pdf", jpgToPdfRoutes);
app.use("/api/word-to-pdf", wordToPdfRoutes);
app.use("/api/html-to-pdf", htmlToPdfRoutes);
app.use("/api/protect-pdf", protectPdfRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  Sentry.captureException(err);
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message = "File size exceeds 50MB limit";
  } else if (
    message === "Only PDF files are allowed" ||
    message === "Only PDF and image files are allowed"
  ) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Cleanup temp files on startup
fs.emptyDirSync(tempDir);

// Start server for local development
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;
