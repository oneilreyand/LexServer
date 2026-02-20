# Backend Documentation

## Overview

This repository contains the backend server for the LexServer application. It is built using Node.js, Express, and PostgreSQL (via Sequelize ORM). The server handles user authentication, video management, notifications, and activity logging.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: Passport.js (Google OAuth), JWT (JSON Web Tokens)
- **Notifications**: Firebase Cloud Messaging (FCM) via `firebase-admin`
- **Environment Management**: dotenv
- **Deployment**: Configured for Vercel (`serverless-http`)

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory with the following variables:
    ```env
    PORT=3002
    NODE_ENV=development
    DATABASE_URL=postgres://user:password@host:port/database
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```
    *Note: Firebase credentials should be configured in `config/firebaseAdmin.js`.*

3.  **Run Locally**:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3002` by default.

## API Authentication

- Most endpoints require a valid JWT Access Token.
- Include the token in the `Authorization` header:
  ```
  Authorization: Bearer <your_access_token>
  ```
- Public endpoints: `/login`, `/register`, `/auth/google`, `/videos` (some read operations may vary based on implementation details, but generally read is protected in this repo).

---

## API Reference

### 1. User Authentication & Management (`/users`)

#### Register
- **Endpoint**: `POST /users/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response**: Returns User object, `token`, and `refreshToken`.

#### Login
- **Endpoint**: `POST /users/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns User object, `token`, and `refreshToken`.

#### Google Auth
- **Endpoint**: `GET /users/auth/google`
- **Description**: Initiates Google OAuth flow.

#### Profile
- **Get Profile**: `GET /users/profile` (Current user) or `GET /users/profile/:id` (Specific user)
- **Create/Update Profile**: `POST /users/profile`
  - **Body**:
    ```json
    {
      "name": "Jane",
      "lastName": "Doe",
      "phoneNumber": "08123456789",
      "address": "Jakarta",
      "provinsi": "DKI Jakarta",
      "kotaKabupaten": "Jakarta Selatan",
      "kecamatan": "Tebet",
      "githubLink": "https://github.com/janedoe"
    }
    ```

#### Token Management
- **Refresh Token**: `POST /users/refresh-token`
  - **Body**: `{ "refreshToken": "..." }`
- **Verify Token**: `GET /users/verify`
- **Logout**: `POST /users/logout`

#### FCM Token
- **Update FCM Token**: `POST /users/fcm-token`
  - **Body**: `{ "fcmToken": "..." }`
  - **Description**: Updates the Firebase Cloud Messaging token for push notifications.

---

### 2. Video Management (`/videos`)

#### Get All Videos
- **Endpoint**: `GET /videos`
- **Description**: Retrieves a list of all videos.

#### Get Featured Videos
- **Endpoint**: `GET /videos/featured?limit=10`

#### Search & Filter
- **Search**: `GET /videos/search?q=query`
- **By Category**: `GET /videos/category/:category`
- **By Skill Level**: `GET /videos/skill-level/:skillLevel`
- **By Instructor**: `GET /videos/instructor/:instructorName`

#### Get Single Video
- **Endpoint**: `GET /videos/:id`

#### Admin Operations (Requires Admin Role)
- **Create Video**: `POST /videos`
  - **Body**:
    ```json
    {
      "title": "Learn React",
      "professor": "Dr. Smith",
      "category": "Programming",
      "videoUrl": "http://...",
      "posterUrl": "http://...",
      "description": "...",
      "skillLevel": "Beginner",
      "students": 100,
      "languages": "English",
      "lectures": 10,
      "duration": "5h 30m",
      "instructorName": "John Smith",
      "instructorRole": "Senior Dev",
      "instructorAvatar": "http://...",
      "rating": 4.5,
      "reviewCount": 20
    }
    ```
- **Update Video**: `PUT /videos/:id`
- **Delete Video**: `DELETE /videos/:id`

---

### 3. Notifications (`/notifications`)

#### Send Notification (Single User)
- **Endpoint**: `POST /notifications/send`
- **Body**:
  ```json
  {
    "userId": "uuid-here",
    "token": "fcm-token-here",
    "title": "Alert",
    "body": "This is a notification",
    "data": { "key": "value" }
  }
  ```

#### Send Multicast (Multiple Users)
- **Endpoint**: `POST /notifications/send-multicast`
- **Body**:
  ```json
  {
    "tokens": ["token1", "token2"],
    "title": "Broadcast",
    "body": "Hello everyone"
  }
  ```

#### Send to Topic
- **Endpoint**: `POST /notifications/send-topic`
- **Body**:
  ```json
  {
    "topic": "news",
    "title": "Breaking News",
    "body": "..."
  }
  ```

---

### 4. Activity Logs (`/users/activity-logs`)

- **Get My Logs**: `GET /users/activity-logs`
- **Get User Logs (Admin)**: `GET /users/activity-logs/:id`
- **Get All Logs (Admin)**: `GET /users/activity-logs/all`
- **Cleanup Logs (Admin)**: `DELETE /users/activity-logs/cleanup` (Body: `{ "daysOld": 90 }`)

---

## Constants & Enums

- **Role**: `user`, `admin`
- **Video Skill Level**: Defined in data (e.g., "Beginner", "Intermediate", "Advanced")
