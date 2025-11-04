const express = require('express');
const router = express.Router();

// Buddy routes
router.get('/', (req, res) => {
  res.json({ message: 'Buddy routes' });
});

module.exports = router;
