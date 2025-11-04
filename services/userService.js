const bcrypt = require('bcryptjs');
const { User, Profile } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

class UserService {
  /**
   * Register a new user with email and password
   * @param {Object} userData - User data
   * @returns {Object} User and token
   */
  async register(userData) {
    const { email, password, name } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user' // Default role
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save tokens to DB
    await user.update({ token, refreshToken });

    return { user: { id: user.id, email: user.email, name: user.name }, token, refreshToken };
  }

  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Object} User and token
   */
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate new tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save tokens to DB (invalidate previous sessions)
    await user.update({ token, refreshToken });

    return { user: { id: user.id, email: user.email, name: user.name }, token, refreshToken };
  }

  /**
   * Find or create user from Google OAuth
   * @param {Object} profile - Google profile
   * @returns {Object} User and token
   */
  async findOrCreateGoogleUser(profile) {
    const { id: googleId, emails, displayName } = profile;

    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ where: { email: emails[0].value } });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId,
          email: emails[0].value,
          name: displayName,
          role: 'user' // Default role
        });
      }
    }

    // Generate new tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save tokens to DB (invalidate previous sessions)
    await user.update({ token, refreshToken });

    return { user: { id: user.id, email: user.email, name: user.name }, token, refreshToken };
  }

  /**
   * Get all users
   * @returns {Array} List of users
   */
  async getAllUsers() {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt']
    });
    return users;
  }

  /**
   * Get user by ID
   * @param {string} id
   * @returns {Object} User
   */
  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      include: [{
        model: Profile,
        as: 'profile',
        attributes: ['id', 'name', 'lastName', 'avatar', 'address', 'phoneNumber', 'provinsi', 'kotaKabupaten', 'kecamatan', 'githubLink']
      }]
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user
   * @param {string} id
   * @param {Object} updateData
   * @returns {Object} Updated user
   */
  async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    const { name, email, role } = updateData;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role; // Allow role updates (admin only)

    await user.save();

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  /**
   * Delete user
   * @param {string} id
   */
  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete associated profile first
    await Profile.destroy({ where: { userId: id } });

    await user.destroy();
  }

  /**
   * Create or update profile
   * @param {string} userId
   * @param {Object} profileData
   * @returns {Object} Profile
   */
  async createOrUpdateProfile(userId, profileData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const [profile, created] = await Profile.upsert({
      userId,
      ...profileData
    });

    return profile;
  }

  /**
   * Get profile by user ID
   * @param {string} userId
   * @returns {Object} Profile
   */
  async getProfileByUserId(userId) {
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  /**
   * Update profile by user ID
   * @param {string} userId
   * @param {Object} profileData
   * @returns {Object} Updated profile
   */
  async updateProfileById(userId, profileData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Validate required fields
    const requiredFields = ['name', 'lastName', 'avatar', 'address', 'phoneNumber', 'provinsi', 'kotaKabupaten', 'kecamatan', 'githubLink'];
    for (const field of requiredFields) {
      if (profileData[field] === undefined || profileData[field] === null || profileData[field] === '') {
        throw new Error(`Field '${field}' is required`);
      }
    }

    // Update profile fields
    const { name, lastName, avatar, address, phoneNumber, provinsi, kotaKabupaten, kecamatan, githubLink } = profileData;

    profile.name = name;
    profile.lastName = lastName;
    profile.avatar = avatar;
    profile.address = address;
    profile.phoneNumber = phoneNumber;
    profile.provinsi = provinsi;
    profile.kotaKabupaten = kotaKabupaten;
    profile.kecamatan = kecamatan;
    profile.githubLink = githubLink;

    await profile.save();

    return profile;
  }
}

module.exports = new UserService();
