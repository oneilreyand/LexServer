const express = require('express');
const router = express.Router();

// Quest routes
router.get('/', (req, res) => {
  res.json({ message: 'Quest routes' });
});

module.exports = router;
