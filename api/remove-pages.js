const { PDFDocument } = require('pdf-lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { pdf, pagesToRemove } = req.body;
    
    if (!pdf || !pagesToRemove) {
      return res.status(400).json({ error: 'PDF data and pages to remove required' });
    }

    const pdfBuffer = Buffer.from(pdf, 'base64');
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    const pagesToDelete = JSON.parse(pagesToRemove).map(p => p - 1);
    
    // Remove pages in reverse order to maintain indices
    pagesToDelete.sort((a, b) => b - a).forEach(pageIndex => {
      if (pageIndex >= 0 && pageIndex < totalPages) {
        pdfDoc.removePage(pageIndex);
      }
    });

    const pdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="removed-pages.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove pages' });
  }
};