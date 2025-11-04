const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Send notification to a single user
router.post('/send', notificationController.sendNotification);

// Send notification to multiple users
router.post('/send-multicast', notificationController.sendMulticastNotification);

// Send notification to a topic
router.post('/send-topic', notificationController.sendTopicNotification);

// Simulate notification (for testing)
router.post('/simulate', notificationController.simulateNotification);

module.exports = router;
