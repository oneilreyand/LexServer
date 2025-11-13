# Video API Documentation

## Base URL
```
http://localhost:3002/videos
```

## Authentication
- **Protected endpoints**: All endpoints require authentication
- **Admin-only endpoints**: Create, Update, Delete operations require admin role
- **Token Expiration**: Access tokens expire after 2 minutes
- **Headers**: `Authorization: Bearer <token>`

## Video Data Model

```json
{
  "id": "uuid",
  "title": "string",
  "professor": "string",
  "category": "string",
  "videoUrl": "string",
  "posterUrl": "string",
  "description": "string",
  "skillLevel": "string",
  "students": "integer",
  "languages": "string",
  "captions": "boolean",
  "lectures": "integer",
  "duration": "string",
  "instructorName": "string",
  "instructorRole": "string",
  "instructorAvatar": "string",
  "rating": "float",
  "reviewCount": "integer",
  "progress": "integer",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Endpoints

### 1. Get All Videos
**GET** `/videos`

**Description**: Retrieve all videos with optional filtering

**Query Parameters**:
- `limit` (optional): Number of videos to return (default: all)
- `category` (optional): Filter by category
- `skillLevel` (optional): Filter by skill level

**Response**: Array of video objects

**Example Request**:
```bash
curl -X GET "http://localhost:3002/videos"
```

**Example Response**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "What is AI Engineer?",
    "professor": "Jay Feng",
    "category": "AI",
    "videoUrl": "https://www.youtube.com/watch?v=o0OczKvQ_is",
    "posterUrl": "https://i.ytimg.com/vi/o0OczKvQ_is/hq720.jpg",
    "description": "Nikhil was the second AI engineer...",
    "skillLevel": "All Levels",
    "students": 38815,
    "languages": "English",
    "captions": true,
    "lectures": 35,
    "duration": "4.5 total hours",
    "instructorName": "Devonne Wallbridge",
    "instructorRole": "Web Developer, Designer, and Teacher",
    "instructorAvatar": "https://i.pravatar.cc/100",
    "rating": 4.5,
    "reviewCount": 1200,
    "progress": 45,
    "createdAt": "2024-11-13T02:38:23.000Z",
    "updatedAt": "2024-11-13T02:38:23.000Z"
  }
]
```

### 2. Get Featured Videos
**GET** `/videos/featured`

**Description**: Get highest-rated videos

**Query Parameters**:
- `limit` (optional): Number of videos to return (default: 10)

**Response**: Array of featured video objects

**Example Request**:
```bash
curl -X GET "http://localhost:3002/videos/featured?limit=5"
```

### 3. Search Videos
**GET** `/videos/search`

**Description**: Search videos by title, description, professor, or instructor name

**Query Parameters**:
- `q` (required): Search query string

**Response**: Array of matching video objects

**Example Request**:
```bash
curl -X GET "http://localhost:3002/videos/search?q=react"
```

### 4. Get Videos by Category
**GET** `/videos/category/:category`

**Description**: Get videos filtered by category

**Path Parameters**:
- `category`: Category name (e.g., "AI", "Frontend", "UI/UX")

**Response**: Array of videos in the specified category

**Example Request**:
```bash
curl -X GET "http://localhost:3002/videos/category/AI"
```

### 5. Get Videos by Skill Level
**GET** `/videos/skill-level/:skillLevel`

**Description**: Get videos filtered by skill level

**Path Parameters**:
- `skillLevel`: Skill level ("Beginner", "Intermediate", "All Levels")

**Response**: Array of videos at the specified skill level

**Example Request**:
```bash
curl -X GET "http://localhost:3002/videos/skill-level/Beginner"
```

### 6. Get Videos by Instructor
**GET** `/videos/instructor/:instructorName`

**Description**: Get videos by a specific instructor

**Path Parameters**:
- `instructorName`: Instructor name

**Response**: Array of videos by the specified instructor

**Example Request**:
```bash
curl -X GET "http://localhost:3002/videos/instructor/Devonne%20Wallbridge"
```

### 7. Get Video by ID
**GET** `/videos/:id`

**Description**: Get a specific video by its ID

**Path Parameters**:
- `id`: Video UUID

**Response**: Single video object

**Example Request**:
```bash
curl -X GET "http://localhost:3002/videos/550e8400-e29b-41d4-a716-446655440001"
```

### 8. Create Video (Admin Only)
**POST** `/videos`

**Description**: Create a new video (requires admin authentication)

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**: Video object (without id, createdAt, updatedAt)

**Example Request**:
```bash
curl -X POST "http://localhost:3002/videos" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Video Tutorial",
    "professor": "John Doe",
    "category": "Frontend",
    "videoUrl": "https://example.com/video",
    "posterUrl": "https://example.com/poster.jpg",
    "description": "A comprehensive tutorial",
    "skillLevel": "Beginner",
    "students": 0,
    "languages": "English",
    "captions": true,
    "lectures": 10,
    "duration": "2 hours",
    "instructorName": "John Doe",
    "instructorRole": "Developer",
    "instructorAvatar": "https://example.com/avatar.jpg",
    "rating": 0,
    "reviewCount": 0,
    "progress": 0
  }'
```

**Response**: Created video object

### 9. Update Video (Admin Only)
**PUT** `/videos/:id`

**Description**: Update an existing video (requires admin authentication)

**Path Parameters**:
- `id`: Video UUID

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**: Partial video object with fields to update

**Example Request**:
```bash
curl -X PUT "http://localhost:3002/videos/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Video Title",
    "rating": 4.8,
    "reviewCount": 1500
  }'
```

**Response**: Updated video object

### 10. Delete Video (Admin Only)
**DELETE** `/videos/:id`

**Description**: Delete a video (requires admin authentication)

**Path Parameters**:
- `id`: Video UUID

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Example Request**:
```bash
curl -X DELETE "http://localhost:3002/videos/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response**:
```json
{
  "message": "Video deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Video not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

## Categories Available
- AI
- Frontend
- Backend
- UI/UX
- QA
- Data Science
- Security
- Mobile
- DevOps
- Blockchain

## Skill Levels Available
- All Levels
- Beginner
- Intermediate
- Advanced

## Authentication Example

### 1. Register/Login to get token
```bash
# Register
curl -X POST "http://localhost:3002/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User"
  }'

# Login
curl -X POST "http://localhost:3002/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### 2. Use token for authenticated requests
```bash
curl -X POST "http://localhost:3002/videos" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## Notes
- All timestamps are in ISO 8601 format
- UUIDs are used for video IDs
- Search is case-insensitive and searches across title, description, professor, and instructor name
- Featured videos are sorted by rating (descending) then review count (descending)
- Progress field represents completion percentage (0-100)
