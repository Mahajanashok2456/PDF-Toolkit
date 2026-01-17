const request = require("supertest");
const express = require("express");
const convertRoutes = require("./convert");
const { expect } = require("chai");
const app = express();

// Add necessary middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/convert", convertRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File size exceeds 50MB limit';
  } else if (message === 'Only PDF files are allowed') {
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
describe("POST /convert", () => {
  it("should return 400 if no file is provided", async () => {
    const res = await request(app).post("/convert").expect(400);
    expect(res.body.error).to.equal("PDF file is required");
  });

  it("should return 413 if file is too large", async () => {
    const largeBuffer = Buffer.alloc(51 * 1024 * 1024); // 51MB
    const res = await request(app)
      .post("/convert")
      .attach("pdf", largeBuffer, "large.pdf")
      .expect(413);
    expect(res.body.error).to.equal("File size exceeds 50MB limit");
  });

  it("should return 400 for non-PDF file", async () => {
    const res = await request(app)
      .post("/convert")
      .attach("pdf", Buffer.from("not a pdf"), "test.txt")
      .expect(400);
    expect(res.body.error).to.equal("Only PDF files are allowed");
  });
});
