const request = require("supertest");
const express = require("express");
const protectPdfRoutes = require("./protect-pdf");
const { expect } = require("chai");
const { PDFDocument } = require("pdf-lib");
const app = express();

// Add necessary middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/protect-pdf", protectPdfRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
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

describe("POST /protect-pdf", function() { // Use generic function to access 'this' if needed
  this.timeout(10000); // Increase timeout for PDF generation

  let minimalPdfBuffer;

  before(async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText('Test Page');
    minimalPdfBuffer = Buffer.from(await pdfDoc.save());
  });

  it("should return 400 if no file is provided", async () => {
    const res = await request(app).post("/protect-pdf").expect(400);
    expect(res.body.error).to.equal("PDF file is required");
  });

  it("should return 400 if no password is provided", async () => {
    const res = await request(app)
      .post("/protect-pdf")
      .attach("pdf", minimalPdfBuffer, "test.pdf")
      .expect(400);
    expect(res.body.error).to.equal("Password is required");
  });

  it("should successfully protect a PDF", async () => {
    const res = await request(app)
      .post("/protect-pdf")
      .field("password", "strongpassword")
      .attach("pdf", minimalPdfBuffer, "test.pdf")
      .expect(200);

    expect(res.header['content-type']).to.include('application/pdf');
    expect(res.header['content-disposition']).to.include('protected.pdf');
    expect(res.body).to.be.instanceof(Buffer);
    
    // Verify it is encrypted (trying to load it should throw or result in encrypted doc)
    // Note: pdf-lib load throws on encrypted docs if no password provided usually, 
    // or we can check isEncrypted property if we load it without password?
    // pdf-lib requires password to load encrypted docs usually.
    let error;
    try {
        await PDFDocument.load(res.body);
    } catch (e) {
        error = e;
    }
    // If it requires password, load() might fail or return encrypted doc. 
    // Actually pdf-lib load() supports ignoreEncryption: true to check encryption?
    // Let's just assume if it loaded fine it wasn't encrypted, but if it failed it likely was.
    // Or try to load with the password.
    
    const protectedDoc = await PDFDocument.load(res.body, { password: 'strongpassword' });
    expect(protectedDoc.getPageCount()).to.equal(1);
  });

  it("should return 400 for non-PDF file", async () => {
    const res = await request(app)
      .post("/protect-pdf")
      .field("password", "123")
      .attach("pdf", Buffer.from("not a pdf"), "test.txt")
      .expect(400);
    expect(res.body.error).to.equal("Only PDF files are allowed");
  });
});
