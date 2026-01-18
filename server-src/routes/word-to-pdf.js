const express = require('express');
const router = express.Router();

// Word to PDF conversion temporarily disabled to reduce bundle size
router.post('/', (req, res) => {
  res.status(503).json({ 
    error: "Word to PDF conversion temporarily unavailable. Please try PDF to Word instead or use an alternative service." 
  });
});

module.exports = router;