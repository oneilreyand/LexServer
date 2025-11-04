const notificationService = require('../services/notificationService');
const { User } = require('../models');

class NotificationController {
  /**
   * Send notification to a single user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendNotification(req, res) {
    try {
      const { token, title, body, data, userId } = req.body;
      if (!token || !title || !body) {
        return res.status(400).json({ error: 'Token, title, and body are required' });
      }

      // If userId is provided, check if the token matches the user's FCM token

      if(!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      } else {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        if (user.fcmToken !== token) {
          return res.status(400).json({ error: 'FCM token does not match the user\'s stored token' });
        }
        const result = await notificationService.sendNotification(token, title, body, data);
        if (result.success) {
          res.status(200).json({ message: 'Notification sent successfully', messageId: result.messageId });
        } else {
          res.status(500).json({ error: 'Failed to send notification', details: result.error });
        }
      }
   
    } catch (error) {
      console.error('Error in sendNotification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Send notification to multiple users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendMulticastNotification(req, res) {
    try {
      const { tokens, title, body, data } = req.body;

      if (!tokens || !Array.isArray(tokens) || tokens.length === 0 || !title || !body) {
        return res.status(400).json({ error: 'Tokens array, title, and body are required' });
      }

      const result = await notificationService.sendMulticastNotification(tokens, title, body, data);

      if (result.success) {
        res.status(200).json({ message: 'Multicast notifications sent', responses: result.responses });
      } else {
        res.status(500).json({ error: 'Failed to send multicast notifications', details: result.error });
      }
    } catch (error) {
      console.error('Error in sendMulticastNotification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Send notification to a topic
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendTopicNotification(req, res) {
    try {
      const { topic, title, body, data } = req.body;

      if (!topic || !title || !body) {
        return res.status(400).json({ error: 'Topic, title, and body are required' });
      }

      const result = await notificationService.sendTopicNotification(topic, title, body, data);

      if (result.success) {
        res.status(200).json({ message: 'Topic notification sent successfully', messageId: result.messageId });
      } else {
        res.status(500).json({ error: 'Failed to send topic notification', details: result.error });
      }
    } catch (error) {
      console.error('Error in sendTopicNotification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Simulate sending notification (for testing purposes)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async simulateNotification(req, res) {
    try {
      const { token, title, body, data } = req.body;

      if (!token || !title || !body) {
        return res.status(400).json({ error: 'Token, title, and body are required' });
      }

      // Simulate successful FCM response
      const mockMessageId = `projects/ndeks-fcm/messages/${Date.now()}`;

      res.status(200).json({
        message: 'Notification sent successfully',
        messageId: mockMessageId,
        simulated: true,
        requestData: { token, title, body, data }
      });
    } catch (error) {
      console.error('Error in simulateNotification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new NotificationController();
