const express = require('express');
const router = express.Router();

// Course routes
router.get('/', (req, res) => {
  res.json({ message: 'Course routes' });
});

module.exports = router;
