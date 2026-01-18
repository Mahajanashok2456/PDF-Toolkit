const { PDFDocument } = require('pdf-lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { pdf, pagesToExtract } = req.body;
    
    if (!pdf || !pagesToExtract) {
      return res.status(400).json({ error: 'PDF data and pages to extract required' });
    }

    const pdfBuffer = Buffer.from(pdf, 'base64');
    const sourcePdf = await PDFDocument.load(pdfBuffer);
    const newPdf = await PDFDocument.create();
    
    const pageIndices = JSON.parse(pagesToExtract).map(p => p - 1);
    const pages = await newPdf.copyPages(sourcePdf, pageIndices);
    pages.forEach(page => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="extracted-pages.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract pages' });
  }
};