const { Video } = require('../models');

class VideoService {
  /**
   * Get all videos
   * @returns {Array} List of videos
   */
  async getAllVideos() {
    const videos = await Video.findAll({
      order: [['createdAt', 'DESC']]
    });
    return videos;
  }

  /**
   * Get video by ID
   * @param {string} id
   * @returns {Object} Video
   */
  async getVideoById(id) {
    const video = await Video.findByPk(id);
    if (!video) {
      throw new Error('Video not found');
    }
    return video;
  }

  /**
   * Create a new video
   * @param {Object} videoData
   * @returns {Object} Created video
   */
  async createVideo(videoData) {
    const video = await Video.create(videoData);
    return video;
  }

  /**
   * Update video
   * @param {string} id
   * @param {Object} updateData
   * @returns {Object} Updated video
   */
  async updateVideo(id, updateData) {
    const video = await Video.findByPk(id);
    if (!video) {
      throw new Error('Video not found');
    }

    const { title, professor, category, videoUrl, posterUrl, description, skillLevel, students, languages, captions, lectures, duration, instructorName, instructorRole, instructorAvatar, rating, reviewCount, progress } = updateData;

    if (title !== undefined) video.title = title;
    if (professor !== undefined) video.professor = professor;
    if (category !== undefined) video.category = category;
    if (videoUrl !== undefined) video.videoUrl = videoUrl;
    if (posterUrl !== undefined) video.posterUrl = posterUrl;
    if (description !== undefined) video.description = description;
    if (skillLevel !== undefined) video.skillLevel = skillLevel;
    if (students !== undefined) video.students = students;
    if (languages !== undefined) video.languages = languages;
    if (captions !== undefined) video.captions = captions;
    if (lectures !== undefined) video.lectures = lectures;
    if (duration !== undefined) video.duration = duration;
    if (instructorName !== undefined) video.instructorName = instructorName;
    if (instructorRole !== undefined) video.instructorRole = instructorRole;
    if (instructorAvatar !== undefined) video.instructorAvatar = instructorAvatar;
    if (rating !== undefined) video.rating = rating;
    if (reviewCount !== undefined) video.reviewCount = reviewCount;
    if (progress !== undefined) video.progress = progress;

    await video.save();
    return video;
  }

  /**
   * Delete video
   * @param {string} id
   */
  async deleteVideo(id) {
    const video = await Video.findByPk(id);
    if (!video) {
      throw new Error('Video not found');
    }

    await video.destroy();
  }

  /**
   * Get videos by category
   * @param {string} category
   * @returns {Array} List of videos
   */
  async getVideosByCategory(category) {
    const videos = await Video.findAll({
      where: { category },
      order: [['createdAt', 'DESC']]
    });
    return videos;
  }

  /**
   * Get videos by skill level
   * @param {string} skillLevel
   * @returns {Array} List of videos
   */
  async getVideosBySkillLevel(skillLevel) {
    const videos = await Video.findAll({
      where: { skillLevel },
      order: [['createdAt', 'DESC']]
    });
    return videos;
  }

  /**
   * Search videos by title or description
   * @param {string} query
   * @returns {Array} List of videos
   */
  async searchVideos(query) {
    const videos = await Video.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { title: { [require('sequelize').Op.iLike]: `%${query}%` } },
          { description: { [require('sequelize').Op.iLike]: `%${query}%` } },
          { professor: { [require('sequelize').Op.iLike]: `%${query}%` } },
          { instructorName: { [require('sequelize').Op.iLike]: `%${query}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    return videos;
  }

  /**
   * Get featured videos (highest rated)
   * @param {number} limit
   * @returns {Array} List of videos
   */
  async getFeaturedVideos(limit = 10) {
    const videos = await Video.findAll({
      order: [['rating', 'DESC'], ['reviewCount', 'DESC']],
      limit
    });
    return videos;
  }

  /**
   * Get videos by instructor
   * @param {string} instructorName
   * @returns {Array} List of videos
   */
  async getVideosByInstructor(instructorName) {
    const videos = await Video.findAll({
      where: { instructorName },
      order: [['createdAt', 'DESC']]
    });
    return videos;
  }
}

module.exports = new VideoService();
