const admin = require('firebase-admin');

class NotificationService {
  /**
   * Send FCM notification to a single device
   * @param {string} token - FCM token of the device
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} data - Additional data payload
   * @returns {Object} Response from FCM
   */
  async sendNotification(token, title, body, data = {}) {
    const message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send FCM notification to multiple devices
   * @param {Array} tokens - Array of FCM tokens
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} data - Additional data payload
   * @returns {Object} Response from FCM
   */
  async sendMulticastNotification(tokens, title, body, data = {}) {
    const message = {
      tokens: tokens,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('Successfully sent multicast message:', response);
      return { success: true, responses: response.responses };
    } catch (error) {
      console.error('Error sending multicast message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification to a topic
   * @param {string} topic - Topic name
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} data - Additional data payload
   * @returns {Object} Response from FCM
   */
  async sendTopicNotification(topic, title, body, data = {}) {
    const message = {
      topic: topic,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent topic message:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending topic message:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();
