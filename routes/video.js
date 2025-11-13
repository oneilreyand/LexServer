const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Get all videos
router.get('/', authenticateToken, videoController.getAllVideos);

// Get featured videos
router.get('/featured', authenticateToken, videoController.getFeaturedVideos);

// Search videos
router.get('/search', authenticateToken, videoController.searchVideos);

// Get videos by category
router.get('/category/:category', authenticateToken, videoController.getVideosByCategory);

// Get videos by skill level
router.get('/skill-level/:skillLevel', authenticateToken, videoController.getVideosBySkillLevel);

// Get videos by instructor
router.get('/instructor/:instructorName', authenticateToken, videoController.getVideosByInstructor);

// Get video by ID
router.get('/:id', authenticateToken, videoController.getVideoById);

// Create video (admin only)
router.post('/', authenticateToken, authorizeAdmin, videoController.createVideo);

// Update video (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, videoController.updateVideo);

// Delete video (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, videoController.deleteVideo);

module.exports = router;
