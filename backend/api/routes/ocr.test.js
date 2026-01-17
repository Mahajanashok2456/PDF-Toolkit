const request = require("supertest");
const express = require("express");
const { expect } = require("chai");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Mock dependencies
const convertStub = {
  bulk: sinon.stub().resolves([{ buffer: Buffer.from("fake image") }])
};

const pdf2picStub = {
  pdf2pic: {
    fromPath: sinon.stub().returns(convertStub)
  }
};

const workerStub = {
  recognize: sinon.stub().resolves({ data: { text: "Recognized Text Content" } }),
  terminate: sinon.stub().resolves()
};

const tesseractStub = {
  createWorker: sinon.stub().resolves(workerStub)
};

// Mock fs-extra to avoid actual file writes/reads if possible, 
// but multer writes to memory, and ocr.js writes manual temp file.
// We should catch that temp file write or just let it write to a temp folder if we want integration,
// but for unit test, let's mock the writeFileSync and unlinkSync to be safe and fast.
const fsStub = {
  ...fs,
  writeFileSync: sinon.stub(),
  unlinkSync: sinon.stub(),
  existsSync: sinon.stub().returns(true) 
};

// Start the app with mocked routes
const ocrRoutes = proxyquire("./ocr", {
  "pdf2pic": pdf2picStub,
  "tesseract.js": tesseractStub,
  "fs-extra": fsStub
});

app.use("/ocr", ocrRoutes);

app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 413;
        message = 'File size exceeds 50MB limit';
    }
    res.status(statusCode).json({ error: message });
});

describe("POST /ocr", function() {
  this.timeout(5000);

  let minimalPdfBuffer = Buffer.from("%PDF-1.4\n...");

  beforeEach(() => {
    // Reset stubs
    convertStub.bulk.resetHistory();
    // Default behavior
    convertStub.bulk.resolves([{ buffer: Buffer.from("fake image") }]);
    workerStub.recognize.resetHistory();
    fsStub.writeFileSync.resetHistory();
    fsStub.unlinkSync.resetHistory();
  });

  it("should return 400 if no file is provided", async () => {
    const res = await request(app).post("/ocr").expect(400);
    expect(res.body.error).to.equal("PDF file is required");
  });

  it("should perform OCR on a valid PDF", async () => {
    const res = await request(app)
      .post("/ocr")
      .attach("pdf", minimalPdfBuffer, "test.pdf")
      .expect(200);

    expect(res.header['content-type']).to.include('text/plain');
    expect(res.text).to.contain("Recognized Text Content");
    
    // Verify mocks were called
    expect(pdf2picStub.pdf2pic.fromPath.called).to.be.true;
    expect(convertStub.bulk.calledWith(-1)).to.be.true;
    expect(tesseractStub.createWorker.calledWith('eng')).to.be.true;
    expect(workerStub.recognize.called).to.be.true;
    expect(workerStub.terminate.called).to.be.true;
  });

  it("should handle processing errors gracefully", async () => {
    // Force an error in processing
    convertStub.bulk.rejects(new Error("Conversion failed"));

    const res = await request(app)
      .post("/ocr")
      .attach("pdf", minimalPdfBuffer, "test.pdf")
      .expect(500);

    expect(res.body.error).to.equal("Conversion failed");
  });
});
