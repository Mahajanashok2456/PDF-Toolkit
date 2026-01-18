const { PDFDocument } = require('pdf-lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { pdf, password } = req.body;
    
    if (!pdf || !password) {
      return res.status(400).json({ error: 'PDF data and password required' });
    }

    const pdfBuffer = Buffer.from(pdf, 'base64');
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Note: pdf-lib doesn't support password protection
    // This is a placeholder - you'd need a different library like PDFtk
    const pdfBytes = await pdfDoc.save();
    
    res.status(503).json({ 
      error: 'Password protection requires additional libraries. Use external service or PDFtk.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to protect PDF' });
  }
};