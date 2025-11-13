require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const serverless = require('serverless-http');
const db = require('../models');
const admin = require('../config/firebaseAdmin'); // ✅ pakai instance dari file config

// Routes
const indexRoutes = require('../routes/index');
const userRoutes = require('../routes/user');
const buddyRoutes = require('../routes/buddy');
const courseRoutes = require('../routes/course');
const questRoutes = require('../routes/quest');
const notificationRoutes = require('../routes/notification');
const videoRoutes = require('../routes/video');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Google Auth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/users/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  ));
}
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/buddies', buddyRoutes);
app.use('/courses', courseRoutes);
app.use('/quests', questRoutes);
app.use('/notifications', notificationRoutes);
app.use('/videos', videoRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Sync DB once
db.sequelize.sync({ force: false })
  .then(() => console.log('✅ Database synced successfully'))
  .catch((err) => console.error('❌ Error syncing database:', err));

module.exports = serverless(app);
