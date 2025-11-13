require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const admin = require('firebase-admin');
const serverless = require('serverless-http');
const db = require('../models');

// Routes
const indexRoutes = require('../routes/index');
const userRoutes = require('../routes/user');
const buddyRoutes = require('../routes/buddy');
const courseRoutes = require('../routes/course');
const questRoutes = require('../routes/quest');
const notificationRoutes = require('../routes/notification');
const videoRoutes = require('../routes/video');

// ============================
// ✅ ENVIRONMENT CHECK
// ============================
function checkRequiredEnvVars() {
  const requiredVars = [
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_CLIENT_X509_CERT_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`
    );
  }
}
checkRequiredEnvVars();

// ============================
// ✅ FIREBASE ADMIN (SAFE INIT)
// ============================
const serviceAccount = {
  type: "service_account",
  project_id: "ndeks-fcm",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// ✅ Fix: Only initialize if no app exists
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'ndeks-fcm'
  });
}

// ============================
// ✅ EXPRESS APP SETUP
// ============================
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ============================
// ✅ PASSPORT GOOGLE STRATEGY
// ============================
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

// ============================
// ✅ ROUTES
// ============================
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/buddies', buddyRoutes);
app.use('/courses', courseRoutes);
app.use('/quests', questRoutes);
app.use('/notifications', notificationRoutes);
app.use('/videos', videoRoutes);

// ============================
// ✅ ERROR HANDLERS
// ============================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================
// ✅ DATABASE SYNC
// ============================
db.sequelize
  .sync({ force: false })
  .then(() => console.log('✅ Database synced successfully.'))
  .catch((err) => console.error('❌ Error syncing database:', err));

// ============================
// ✅ EXPORT FOR VERCEL
// ============================
module.exports = serverless(app);
