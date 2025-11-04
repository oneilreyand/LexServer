const activityLogService = require('../services/activityLogService');

class ActivityLogController {
  /**
   * Get activity logs for current user or specified user (admin only)
   */
  async getMyActivityLogs(req, res) {
    try {
      const { id } = req.params;
      const userId = id || req.user.id;

      // If requesting logs for another user, check if admin
      if (id && id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. You can only view your own activity logs.' });
      }

      const { limit = 50, offset = 0, action } = req.query;
      const logs = await activityLogService.getUserActivityLogs(userId, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        action
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all activity logs (admin only)
   */
  async getAllActivityLogs(req, res) {
    try {
      // Only admins can access all logs
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { limit = 100, offset = 0, userId, action } = req.query;
      const logs = await activityLogService.getAllActivityLogs({
        limit: parseInt(limit),
        offset: parseInt(offset),
        userId,
        action
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get activity logs for a specific user (admin only)
   */
  async getUserActivityLogs(req, res) {
    try {
      const { id } = req.params;

      // Only admins can access other users' logs
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required to view other users\' activity logs' });
      }

      const { limit = 50, offset = 0, action } = req.query;
      const logs = await activityLogService.getUserActivityLogs(id, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        action
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete old activity logs (admin only)
   */
  async cleanupOldLogs(req, res) {
    try {
      // Only admins can cleanup logs
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { daysOld = 90 } = req.body;
      const deletedCount = await activityLogService.deleteOldLogs(parseInt(daysOld));
      res.json({ message: `Deleted ${deletedCount} old activity logs` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ActivityLogController();
