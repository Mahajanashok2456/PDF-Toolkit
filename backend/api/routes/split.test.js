const request = require("supertest");
const express = require("express");
const splitRoutes = require("./split");
const { expect } = require("chai");
const app = express();

// Add necessary middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/split", splitRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
describe("POST /split", () => {
  it("should return 400 if no file is provided", async () => {
    const res = await request(app).post("/split").expect(400);
    expect(res.body.error).to.equal("PDF file is required");
  });

  it("should return 400 for invalid page range", async () => {
    // We need a valid PDF to pass load step
    const { PDFDocument } = require('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage();
    pdfDoc.addPage();
    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    const res = await request(app)
      .post("/split")
      .attach("pdf", buffer, "test.pdf")
      .field("startPage", 2)
      .field("endPage", 1)
      .expect(400);
    expect(res.body.error).to.equal("Invalid page range");
  });
});
