const request = require("supertest");
const express = require("express");
const mergeRoutes = require("./merge");
const { expect } = require("chai");
const app = express();

// Add necessary middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/merge", mergeRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'Total file size exceeds 50MB limit';
  }

  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
describe("POST /merge", () => {
  it("should return 400 if less than 2 files are provided", async () => {
    const res = await request(app).post("/merge").expect(400);
    expect(res.body.error).to.equal("At least 2 PDF files are required");
  });

  it("should return 413 if total size exceeds limit", async () => {
    const largeBuffer = Buffer.alloc(26 * 1024 * 1024); // 26MB each, total 52MB
    const res = await request(app)
      .post("/merge")
      .attach("pdfs", largeBuffer, "test1.pdf")
      .attach("pdfs", largeBuffer, "test2.pdf")
      .expect(413);
    expect(res.body.error).to.equal("Total file size exceeds 50MB limit");
  });
});
