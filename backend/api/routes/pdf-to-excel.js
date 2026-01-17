const express = require('express');
const multer = require('multer');
const pdfTableExtractor = require('pdf-table-extractor');
const ExcelJS = require('exceljs');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sentry = require('@sentry/node');
const os = require('os');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

class PDFProcessingError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'PDFProcessingError';
  }
}

router.post('/', upload.single('pdf'), async (req, res) => {
  let tempFilePath = null;
  let outputDir = null;

  try {
    if (!req.file) {
      throw new PDFProcessingError('PDF file is required', 400);
    }

    const jobId = uuidv4();
    const tempDir = os.tmpdir();
    outputDir = path.join(tempDir, `pdf-to-excel-${jobId}`);
    await fs.ensureDir(outputDir);

    tempFilePath = path.join(outputDir, 'input.pdf');
    await fs.writeFile(tempFilePath, req.file.buffer);

    // Extract tables
    const data = await new Promise((resolve, reject) => {
      pdfTableExtractor(tempFilePath, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    });

    if (!data || !data.pageTables || data.pageTables.length === 0) {
      throw new PDFProcessingError('No tabular data found in PDF', 422);
    }

    // Check if we actually have any content
    const hasContent = data.pageTables.some(page => page.tables.length > 0);
    if (!hasContent) {
      throw new PDFProcessingError('No tabular data found in PDF', 422);
    }

    const workbook = new ExcelJS.Workbook();
    
    data.pageTables.forEach((page, pageIndex) => {
        // page.tables is an array of tables, each table is array of rows
        // We can put all tables of a page into one sheet, or separate sheets
        if (page.tables.length > 0) {
            const sheet = workbook.addWorksheet(`Page ${pageIndex + 1}`);
            let currentRow = 1;
            
            page.tables.forEach((table, tableIndex) => {
                if (tableIndex > 0) currentRow += 2; // Spacing between tables
                
                // Check if table has rows
                if (Array.isArray(table)) {
                     // table is array of rows? or table is object?
                     // pdf-table-extractor usually returns tables as array of arrays of strings?
                     // Let's assume table is string[][] (rows -> cells)
                     // Actually usually it is array of rows.
                     table.forEach(row => {
                         sheet.addRow(row);
                         currentRow++;
                     });
                }
            });
        }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting PDF to Excel:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to convert PDF to Excel',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (outputDir) {
      try {
        await fs.remove(outputDir);
      } catch (e) {
        // ignore
      }
    }
  }
});

module.exports = router;
