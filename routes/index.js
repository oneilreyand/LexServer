const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Basic route
router.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Test Firebase connection
router.get('/test-firebase', async (req, res) => {
  try {
    // Attempt to get the Firebase app instance to check if it's initialized
    const app = admin.app();
    res.json({ success: true, message: 'Firebase connection is successful!', projectId: app.options.projectId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
