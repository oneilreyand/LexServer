require('dotenv').config();
const express = require('express');
var admin = require("firebase-admin");

// Function to check required environment variables
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
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
  }
}

// Check for required environment variables
checkRequiredEnvVars();

// Initialize Firebase Admin SDK
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ndeks-fcm'
});
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./models');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const buddyRoutes = require('./routes/buddy');
const courseRoutes = require('./routes/course');
const questRoutes = require('./routes/quest');
const notificationRoutes = require('./routes/notification');

const app = express();
const PORT = process.env.PORT || 3002;

// Passport configuration
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/users/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  ));
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/buddies', buddyRoutes);
app.use('/courses', courseRoutes);
app.use('/quests', questRoutes);
app.use('/notifications', notificationRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Sync database
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
