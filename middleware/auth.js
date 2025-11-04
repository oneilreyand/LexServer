const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT tokens
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);

    // Check if token matches the one stored in DB (single session enforcement)
    const user = await User.findByPk(decoded.id);
    if (!user || user.token !== token) {
      return res.status(401).json({ error: 'Session expired or logged in elsewhere' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware to authorize admin role
 */
function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = {
  authenticateToken,
  authorizeAdmin
};
