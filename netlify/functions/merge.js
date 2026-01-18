const { PDFDocument } = require('pdf-lib');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Simple response for now - Netlify functions have 10MB limit
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'PDF processing requires larger memory limits. Use alternative deployment.' 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Function error' })
    };
  }
};