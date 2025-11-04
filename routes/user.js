const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');
const activityLogController = require('../controllers/activityLogController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Register with email and password
router.post('/register', userController.register);

// Login with email and password
router.post('/login', userController.login);

// Google OAuth login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  userController.googleCallback
);

// Get all users (admin only)
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers);

// Get user by ID (protected)
router.get('/:id', authenticateToken, userController.getUserById);

// Update user (protected)
router.put('/:id', authenticateToken, userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, userController.deleteUser);

// Logout (protected)
router.post('/logout', authenticateToken, userController.logout);

// Refresh token
router.post('/refresh-token', userController.refreshToken);

// Verify token (protected)
router.get('/verify', authenticateToken, userController.verifyToken);

// Profile routes (protected)
router.post('/profile', authenticateToken, userController.createOrUpdateProfile);
router.get('/profile', authenticateToken, userController.getProfile);
router.get('/profile/:id', authenticateToken, userController.getProfile);
router.put('/profile/:id', authenticateToken, userController.updateProfileById);

// FCM token route (protected)
router.post('/fcm-token', authenticateToken, userController.updateFcmToken);

// Activity log routes (protected)
router.get('/activity-logs', authenticateToken, activityLogController.getMyActivityLogs);
router.get('/activity-logs/:id', authenticateToken, activityLogController.getUserActivityLogs);
router.get('/activity-logs/all', authenticateToken, activityLogController.getAllActivityLogs);
router.delete('/activity-logs/cleanup', authenticateToken, activityLogController.cleanupOldLogs);

module.exports = router;
