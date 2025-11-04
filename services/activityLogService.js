const { UserActivityLog } = require('../models');

class ActivityLogService {
  /**
   * Log user activity
   * @param {string} userId
   * @param {string} action
   * @param {string} description
   * @param {Object} req - Express request object for IP and user agent
   * @param {Object} metadata - Additional data
   */
  async logActivity(userId, action, description = null, req = null, metadata = null) {
    try {
      const logData = {
        userId,
        action,
        description,
        metadata
      };

      if (req) {
        logData.ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        logData.userAgent = req.get('User-Agent');
      }

      await UserActivityLog.create(logData);
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw error to avoid breaking main functionality
    }
  }

  /**
   * Get activity logs for a user
   * @param {string} userId
   * @param {Object} options - Pagination and filter options
   * @returns {Array} Activity logs
   */
  async getUserActivityLogs(userId, options = {}) {
    const { limit = 50, offset = 0, action = null } = options;

    const whereClause = { userId };
    if (action) {
      whereClause.action = action;
    }

    const logs = await UserActivityLog.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'action', 'description', 'ipAddress', 'userAgent', 'metadata', 'createdAt']
    });

    return logs;
  }

  /**
   * Get all activity logs (admin only)
   * @param {Object} options - Pagination and filter options
   * @returns {Array} Activity logs with user info
   */
  async getAllActivityLogs(options = {}) {
    const { limit = 100, offset = 0, userId = null, action = null } = options;

    const whereClause = {};
    if (userId) whereClause.userId = userId;
    if (action) whereClause.action = action;

    const logs = await UserActivityLog.findAll({
      where: whereClause,
      include: [{
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'email', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'action', 'description', 'ipAddress', 'userAgent', 'metadata', 'createdAt']
    });

    return logs;
  }

  /**
   * Delete old activity logs (cleanup)
   * @param {number} daysOld - Delete logs older than this many days
   */
  async deleteOldLogs(daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const deletedCount = await UserActivityLog.destroy({
      where: {
        createdAt: {
          [require('sequelize').Op.lt]: cutoffDate
        }
      }
    });

    return deletedCount;
  }
}

module.exports = new ActivityLogService();
