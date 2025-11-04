const userService = require('../services/userService');
const activityLogService = require('../services/activityLogService');
const notificationService = require('../services/notificationService');
const { User, Profile } = require('../models');
const { verifyRefreshToken, generateToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

class UserController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const result = await userService.register({ email, password, name });

      // Log successful registration
      await activityLogService.logActivity(
        result.user.id,
        'REGISTER',
        'User registered successfully',
        req,
        { email, name }
      );

      res.status(201).json(result);
    } catch (error) {
      // Log failed registration attempt
      await activityLogService.logActivity(
        null,
        'REGISTER_FAILED',
        `Failed registration attempt for email: ${req.body.email}`,
        req,
        { email: req.body.email, name: req.body.name, reason: error.message }
      );

      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);

      // Log successful login
      await activityLogService.logActivity(
        result.user.id,
        'LOGIN',
        `User logged in successfully`,
        req,
        { email }
      );

      res.json(result);
    } catch (error) {
      // Log failed login attempt
      await activityLogService.logActivity(
        null, // No user ID for failed login
        'LOGIN_FAILED',
        `Failed login attempt for email: ${req.body.email}`,
        req,
        { email: req.body.email, reason: error.message }
      );

      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async googleCallback(req, res) {
    try {
      const result = await userService.findOrCreateGoogleUser(req.user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      // Log admin viewing all users
      await activityLogService.logActivity(
        req.user.id,
        'VIEW_ALL_USERS',
        'Admin viewed all users list',
        req,
        { userCount: users.length }
      );

      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);

      // Log viewing user profile
      await activityLogService.logActivity(
        req.user.id,
        'VIEW_USER',
        `Viewed user profile for ${req.params.id}`,
        req,
        { targetUserId: req.params.id }
      );

      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Update user
   */
  async updateUser(req, res) {
    try {
      // Check if user is updating themselves or is admin
      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const updatedUser = await userService.updateUser(req.params.id, req.body);

      // Log user update activity
      await activityLogService.logActivity(
        req.user.id,
        'USER_UPDATE',
        `Updated user profile for ${req.params.id}`,
        req,
        { targetUserId: req.params.id, updatedFields: Object.keys(req.body) }
      );

      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(req, res) {
    try {
      // Only admins can delete users
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      await userService.deleteUser(req.params.id);

      // Log user deletion
      await activityLogService.logActivity(
        req.user.id,
        'DELETE_USER',
        `Admin deleted user ${req.params.id}`,
        req,
        { targetUserId: req.params.id }
      );

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(400).json({ error: 'Token required for logout' });
      }

      // Log logout activity
      await activityLogService.logActivity(
        req.user.id,
        'LOGOUT',
        'User logged out',
        req
      );

      // Clear the token from the user record
      const decoded = jwt.decode(token);
      const user = await User.findByPk(decoded.id);
      if (user) {
        await user.update({ token: null, refreshToken: null, fcmToken: null });
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if refresh token matches the one stored in DB
      const user = await User.findByPk(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new access token
      const newAccessToken = generateToken(user);

      // Update access token in DB
      await user.update({ token: newAccessToken });

      // Log token refresh
      await activityLogService.logActivity(
        user.id,
        'TOKEN_REFRESH',
        'Refreshed access token',
        req
      );

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Verify token validity
   */
  async verifyToken(req, res) {
    try {
      // If middleware passed, token is valid

      // Log token verification
      await activityLogService.logActivity(
        req.user.id,
        'TOKEN_VERIFY',
        'Verified token validity',
        req
      );

      res.json({
        valid: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create or update profile
   */
  async createOrUpdateProfile(req, res) {
    try {
      const profileData = req.body;
      const profile = await userService.createOrUpdateProfile(req.user.id, profileData);

      // Log profile update activity
      await activityLogService.logActivity(
        req.user.id,
        'PROFILE_UPDATE',
        'Updated user profile',
        req,
        { updatedFields: Object.keys(profileData) }
      );

      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get profile by user ID
   */
  async getProfile(req, res) {
    try {
      const userId = req.params.id || req.user.id;
      const profile = await userService.getProfileByUserId(userId);

      // Log profile view
      await activityLogService.logActivity(
        req.user.id,
        'VIEW_PROFILE',
        `Viewed profile for user ${userId}`,
        req,
        { targetUserId: userId }
      );

      res.json(profile);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Update profile by user ID
   */
  async updateProfileById(req, res) {
    try {
      // Check if user is updating themselves or is admin
      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const profileData = req.body;
      const profile = await userService.updateProfileById(req.params.id, profileData);

      // Log profile update activity
      await activityLogService.logActivity(
        req.user.id,
        'PROFILE_UPDATE_BY_ID',
        `Updated profile for user ${req.params.id}`,
        req,
        { targetUserId: req.params.id, updatedFields: Object.keys(profileData) }
      );

      // Send FCM notification to topic "profile-updates"
      try {
        await notificationService.sendTopicNotification(
          'profile-updates',
          'Profile Updated',
          `Your profile has been successfully updated.`,
          {
            userId: req.params.id.toString(),
            updatedBy: req.user.id.toString(),
            updatedFields: Object.keys(profileData).join(',')
          }
        );
      } catch (fcmError) {
        console.error('FCM notification failed:', fcmError);
        // Don't fail the request if FCM fails
      }

      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update FCM token for user
   */
  async updateFcmToken(req, res) {
    try {
      const { fcmToken } = req.body;

      if (!fcmToken) {
        return res.status(400).json({ error: 'FCM token is required' });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Validate FCM token by attempting to send a test notification
      const testResult = await notificationService.sendNotification(
        fcmToken,
        'Token Validation',
        'This is a test message to validate your FCM token.',
        { type: 'validation' }
      );

      if (!testResult.success) {
        return res.status(400).json({ error: 'Invalid FCM token. Please provide a valid token.' });
      }

      await user.update({ fcmToken });

      // Log FCM token update
      await activityLogService.logActivity(
        req.user.id,
        'FCM_TOKEN_UPDATE',
        'Updated FCM token',
        req
      );

      res.json({ message: 'FCM token updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
