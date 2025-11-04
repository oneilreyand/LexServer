const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'; // Use environment variable in production

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Generate a refresh JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded payload
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken
};
