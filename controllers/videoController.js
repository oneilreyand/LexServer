const videoService = require('../services/videoService');
const activityLogService = require('../services/activityLogService');

class VideoController {
  /**
   * Get all videos
   */
  async getAllVideos(req, res) {
    try {
      const videos = await videoService.getAllVideos();

      // Log viewing all videos
      if (req.user) {
        await activityLogService.logActivity(
          req.user.id,
          'VIEW_ALL_VIDEOS',
          'Viewed all videos list',
          req,
          { videoCount: videos.length }
        );
      }

      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get video by ID
   */
  async getVideoById(req, res) {
    try {
      const video = await videoService.getVideoById(req.params.id);

      // Log viewing video
      if (req.user) {
        await activityLogService.logActivity(
          req.user.id,
          'VIEW_VIDEO',
          `Viewed video ${req.params.id}`,
          req,
          { videoId: req.params.id, title: video.title }
        );
      }

      res.json(video);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * Create a new video (admin only)
   */
  async createVideo(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const video = await videoService.createVideo(req.body);

      // Log video creation
      await activityLogService.logActivity(
        req.user.id,
        'CREATE_VIDEO',
        `Created video ${video.id}`,
        req,
        { videoId: video.id, title: video.title }
      );

      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update video (admin only)
   */
  async updateVideo(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const updatedVideo = await videoService.updateVideo(req.params.id, req.body);

      // Log video update
      await activityLogService.logActivity(
        req.user.id,
        'UPDATE_VIDEO',
        `Updated video ${req.params.id}`,
        req,
        { videoId: req.params.id, updatedFields: Object.keys(req.body) }
      );

      res.json(updatedVideo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Delete video (admin only)
   */
  async deleteVideo(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      await videoService.deleteVideo(req.params.id);

      // Log video deletion
      await activityLogService.logActivity(
        req.user.id,
        'DELETE_VIDEO',
        `Deleted video ${req.params.id}`,
        req,
        { videoId: req.params.id }
      );

      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get videos by category
   */
  async getVideosByCategory(req, res) {
    try {
      const { category } = req.params;
      const videos = await videoService.getVideosByCategory(category);

      // Log category search
      if (req.user) {
        await activityLogService.logActivity(
          req.user.id,
          'SEARCH_VIDEOS_BY_CATEGORY',
          `Searched videos by category: ${category}`,
          req,
          { category, videoCount: videos.length }
        );
      }

      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get videos by skill level
   */
  async getVideosBySkillLevel(req, res) {
    try {
      const { skillLevel } = req.params;
      const videos = await videoService.getVideosBySkillLevel(skillLevel);

      // Log skill level search
      if (req.user) {
        await activityLogService.logActivity(
          req.user.id,
          'SEARCH_VIDEOS_BY_SKILL_LEVEL',
          `Searched videos by skill level: ${skillLevel}`,
          req,
          { skillLevel, videoCount: videos.length }
        );
      }

      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Search videos
   */
  async searchVideos(req, res) {
    try {
      const { q: query } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const videos = await videoService.searchVideos(query);

      // Log search
      if (req.user) {
        await activityLogService.logActivity(
          req.user.id,
          'SEARCH_VIDEOS',
          `Searched videos with query: ${query}`,
          req,
          { query, videoCount: videos.length }
        );
      }

      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get featured videos
   */
  async getFeaturedVideos(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const videos = await videoService.getFeaturedVideos(limit);

      // Log featured videos view
      if (req.user) {
        await activityLogService.logActivity(
          req.user.id,
          'VIEW_FEATURED_VIDEOS',
          'Viewed featured videos',
          req,
          { limit, videoCount: videos.length }
        );
      }

      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get videos by instructor
   */
  async getVideosByInstructor(req, res) {
    try {
      const { instructorName } = req.params;
      const videos = await videoService.getVideosByInstructor(instructorName);

      // Log instructor search
      if (req.user) {
        await activityLogService.logActivity(
          req.user.id,
          'SEARCH_VIDEOS_BY_INSTRUCTOR',
          `Searched videos by instructor: ${instructorName}`,
          req,
          { instructorName, videoCount: videos.length }
        );
      }

      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VideoController();
