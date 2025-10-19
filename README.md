# 🏔️ Orion Trail API

A comprehensive REST API for managing hiking trails with advanced features including geolocation support, user management, reviews, alerts, and reporting system. Built with Node.js, Express, and Firebase Firestore.

## ✨ Features

- 🏔️ **Trail Management**: Complete CRUD operations for trails
- 📍 **Geolocation Support**: GPS coordinates, routes, and location-based search
- 🔍 **Advanced Search**: Text search, filtering, and proximity-based queries
- 👥 **User Management**: User profiles, favorites, wishlist, and completed trails
- ⭐ **Review System**: Trail reviews with ratings and comments
- 🚨 **Alert System**: Community alerts for trail conditions and safety
- 📋 **Reporting System**: Content moderation and issue reporting
- 📊 **Data Validation**: Comprehensive input validation using Joi
- 🔒 **Security**: Rate limiting, CORS, and security headers
- 📱 **RESTful API**: Clean, well-documented REST endpoints
- 🗄️ **Firebase Integration**: Real-time database with Firestore
- 🧪 **Comprehensive Testing**: 84.49% code coverage with 326 tests

## 🚀 Live API

**Base URL:** `https://orion-api-qeyv.onrender.com`

- **Health Check:** https://orion-api-qeyv.onrender.com/health
- **API Documentation:** https://orion-api-qeyv.onrender.com/api-docs
- **Create Trail:** https://orion-api-qeyv.onrender.com/api/trails

## 📋 API Endpoints

### 🏔️ Trails

#### Create a Trail
```http
POST /api/trails
Content-Type: application/json

{
  "name": "Mountain Peak Trail",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "distance": 5.2,
  "elevationGain": 800,
  "difficulty": "Moderate",
  "tags": ["mountain", "views", "forest"],
  "gpsRoute": [
    {"latitude": 40.7128, "longitude": -74.0060},
    {"latitude": 40.7200, "longitude": -74.0100}
  ],
  "description": "A beautiful trail with stunning mountain views...",
  "photos": ["https://example.com/photo1.jpg"],
  "status": "open",
  "createdBy": "user123"
}
```

#### Get All Trails
```http
GET /api/trails?page=1&limit=10&difficulty=Moderate&status=open
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sort` (string): Sort field - "name", "distance", "elevationGain", "createdAt", "lastUpdated" (default: "createdAt")
- `order` (string): Sort order - "asc" or "desc" (default: "desc")
- `difficulty` (string): Filter by difficulty - "Easy", "Moderate", "Hard", "Expert"
- `status` (string): Filter by status - "open", "closed", "maintenance", "seasonal"
- `tags` (string): Comma-separated tags to filter by
- `minDistance` (number): Minimum distance filter
- `maxDistance` (number): Maximum distance filter
- `minElevation` (number): Minimum elevation gain filter
- `maxElevation` (number): Maximum elevation gain filter

#### Get Trail by ID
```http
GET /api/trails/{trailId}
```

#### Update Trail
```http
PUT /api/trails/{trailId}
Content-Type: application/json

{
  "name": "Updated Trail Name",
  "status": "maintenance"
}
```

#### Delete Trail
```http
DELETE /api/trails/{trailId}
```

#### Search Trails by Text
```http
GET /api/trails/search?q=mountain&difficulty=Moderate&tags=forest,views
```

**Query Parameters:**
- `q` (string, required): Search query
- `difficulty` (string): Filter by difficulty
- `tags` (string): Comma-separated tags
- `status` (string): Filter by status

#### Search Trails Near Location
```http
GET /api/trails/near?latitude=40.7128&longitude=-74.0060&maxDistance=10000&page=1&limit=10
```

**Query Parameters:**
- `latitude` (number, required): Search latitude
- `longitude` (number, required): Search longitude
- `maxDistance` (number): Maximum distance in meters (default: 10000)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

### 👥 Users

#### Add Trail to Favorites
```http
POST /api/users/{userId}/favorites
Content-Type: application/json

{
  "trailId": "trail123"
}
```

#### Remove Trail from Favorites
```http
DELETE /api/users/{userId}/favorites
Content-Type: application/json

{
  "trailId": "trail123"
}
```

#### Add Trail to Wishlist
```http
POST /api/users/{userId}/wishlist
Content-Type: application/json

{
  "trailId": "trail123"
}
```

#### Remove Trail from Wishlist
```http
DELETE /api/users/{userId}/wishlist
Content-Type: application/json

{
  "trailId": "trail123"
}
```

#### Mark Trail as Completed
```http
POST /api/users/{userId}/completed
Content-Type: application/json

{
  "trailId": "trail123"
}
```

#### Remove Trail from Completed
```http
DELETE /api/users/{userId}/completed
Content-Type: application/json

{
  "trailId": "trail123"
}
```

#### Get User's Saved Trails
```http
GET /api/users/{userId}/saved-trails
```

#### Get User Profile
```http
GET /api/users/{userId}
```

#### Update User Profile
```http
PUT /api/users/{userId}
Content-Type: application/json

{
  "profileInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### ⭐ Reviews

#### Get All Reviews
```http
GET /api/reviews?page=1&limit=10&trailId=trail123
```

#### Get Reviews for a Trail
```http
GET /api/reviews/trail?trailId=trail123
```

#### Create a Review
```http
POST /api/reviews
Content-Type: application/json

{
  "trailId": "trail123",
  "review": {
    "id": "review123",
    "userId": "user123",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "rating": 5,
    "comment": "Amazing trail with beautiful views!",
    "photos": ["https://example.com/photo1.jpg"]
  }
}
```

#### Get Review by ID
```http
GET /api/reviews/{trailId}/{reviewId}
```

#### Update Review
```http
PUT /api/reviews/{trailId}/{reviewId}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review comment"
}
```

#### Delete Review
```http
DELETE /api/reviews/{trailId}/{reviewId}
```

### 🚨 Alerts

#### Get All Alerts
```http
GET /api/alerts?page=1&limit=10&status=active
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status - "all", "active", "inactive" (default: "all")

#### Get Alerts for a Trail
```http
GET /api/alerts/trail?trailId=trail123
```

#### Create an Alert
```http
POST /api/alerts
Content-Type: application/json

{
  "trailId": "trail123",
  "message": "Trail closed due to weather conditions",
  "type": "authority",
  "comment": "Heavy rain expected",
  "isTimed": true,
  "duration": 120
}
```

#### Get Alert by ID
```http
GET /api/alerts/{alertId}
```

#### Update Alert
```http
PUT /api/alerts/{alertId}
Content-Type: application/json

{
  "isActive": false,
  "message": "Updated alert message"
}
```

#### Delete Alert
```http
DELETE /api/alerts/{alertId}
```

### 📋 Reports

#### Get All Reports
```http
GET /api/reports?page=1&limit=10&status=pending&type=trail
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status - "all", "pending", "reviewed", "resolved", "dismissed" (default: "all")
- `type` (string): Filter by type - "all", "trail", "review", "image", "alert", "general" (default: "all")

#### Create a Report
```http
POST /api/reports
Content-Type: application/json

{
  "type": "trail",
  "category": "safety",
  "description": "Broken bridge on trail",
  "priority": "high",
  "trailId": "trail123",
  "trailName": "Mountain Peak Trail",
  "reporterId": "user123"
}
```

#### Get Report by ID
```http
GET /api/reports/{reportId}
```

#### Update Report Status
```http
PUT /api/reports/{reportId}/status
Content-Type: application/json

{
  "status": "resolved"
}
```

#### Update Report
```http
PUT /api/reports/{reportId}
Content-Type: application/json

{
  "status": "reviewed",
  "priority": "medium",
  "description": "Updated description"
}
```

#### Delete Report
```http
DELETE /api/reports/{reportId}
```

#### Get Reports by User
```http
GET /api/reports/user/{userId}?page=1&limit=10
```

## 📊 Data Models

### Trail Document Structure
```javascript
{
  name: String,                    // Trail name (required, max 100 chars)
  location: {                      // GPS coordinates (required)
    latitude: Number,              // -90 to 90
    longitude: Number              // -180 to 180
  },
  distance: Number,                // Distance in kilometers (required, >= 0)
  elevationGain: Number,           // Elevation gain in meters (required, >= 0)
  difficulty: String,              // "Easy", "Moderate", "Hard", "Expert" (required)
  tags: [String],                  // Array of tags (max 10, 50 chars each)
  gpsRoute: [{                     // GPS route points (min 2 points)
    latitude: Number,
    longitude: Number
  }],
  description: String,             // Trail description (required, max 2000 chars)
  photos: [String],                // Array of photo URLs (max 20)
  status: String,                  // "open", "closed", "maintenance", "seasonal"
  createdBy: String,               // User ID who created the trail (required)
  createdAt: Timestamp,            // Creation timestamp
  lastUpdated: Timestamp           // Last update timestamp
}
```

### User Document Structure
```javascript
{
  profileInfo: {                   // User profile information
    name: String,                  // User's full name
    email: String,                 // User's email address
    joinedDate: Timestamp          // When user joined
  },
  submittedTrails: [String],       // Array of trail IDs submitted by user
  favourites: [String],            // Array of favorite trail IDs
  completedHikes: [String],        // Array of completed trail IDs
  wishlist: [String]               // Array of trail IDs in wishlist
}
```

### Review Document Structure
```javascript
{
  id: String,                      // Unique review ID
  userId: String,                  // User ID who wrote the review
  userName: String,                // Display name of the user
  userEmail: String,               // User's email address
  rating: Number,                  // Rating from 1 to 5 (required)
  comment: String,                 // Review text content (required)
  photos: [String],                // Array of photo URLs
  timestamp: Timestamp             // Review timestamp
}
```

### Alert Document Structure
```javascript
{
  trailId: String,                 // ID of the trail (required)
  message: String,                 // Alert message (required)
  type: String,                    // "community", "authority", "emergency" (required)
  comment: String,                 // Additional comment
  isActive: Boolean,               // Whether the alert is active
  isTimed: Boolean,                // Whether this is a timed alert
  duration: Number,                // Duration in minutes (for timed alerts)
  createdAt: Timestamp,            // Creation timestamp
  expiresAt: Timestamp             // Expiration timestamp (for timed alerts)
}
```

### Report Document Structure
```javascript
{
  type: String,                    // "trail", "review", "image", "alert", "general" (required)
  category: String,                // Specific category based on report type (required)
  description: String,             // Detailed description of the issue (required)
  priority: String,                // "low", "medium", "high", "urgent" (default: "medium")
  status: String,                  // "pending", "reviewed", "resolved", "dismissed"
  additionalDetails: String,       // Optional additional information
  targetId: String,                // ID of the specific item being reported
  trailId: String,                 // ID of the associated trail
  trailName: String,               // Name of the trail for reference
  reporterId: String,              // Firebase Auth UID of the user who submitted the report
  createdAt: Timestamp,            // Creation timestamp
  updatedAt: Timestamp             // Last update timestamp
}
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    // Pagination info (for list endpoints)
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Detailed error messages"
  ]
}
```

## 🔢 HTTP Status Codes

- `200` - OK (successful request)
- `201` - Created (resource created successfully)
- `400` - Bad Request (validation errors, invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (permission denied)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Firebase project with Firestore enabled

### 1. Clone the Repository
```bash
git clone <repository-url>
cd orion-trail-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp env.example .env
```

Update the `.env` file with your Firebase configuration:
```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket.appspot.com
PORT=3000
NODE_ENV=development
```

### 4. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Coverage
- **Overall Coverage**: 84.49% statement coverage
- **Total Tests**: 326 passing tests
- **Controllers**: 75-86% coverage
- **Models**: 100% coverage
- **Middleware**: 100% coverage
- **Routes**: 100% coverage

## 🔧 Development Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run test:coverage # Run tests with coverage report
npm run test:ci      # Run tests in CI mode
npm run lint         # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
```

## 📁 Project Structure

```
src/
├── app.js                    # Main application file
├── config/
│   ├── database.js          # Firebase configuration
│   └── swagger.js           # API documentation setup
├── controllers/
│   ├── alertController.js   # Alert CRUD operations
│   ├── reportController.js  # Report CRUD operations
│   ├── reviewController.js  # Review CRUD operations
│   ├── trailController.js   # Trail CRUD operations
│   └── userController.js    # User management operations
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── Trail.js             # Trail model and validation
│   └── User.js              # User model and validation
├── routes/
│   ├── alertRoutes.js       # Alert API routes
│   ├── reportRoutes.js      # Report API routes
│   ├── reviewRoutes.js      # Review API routes
│   ├── trailRoutes.js       # Trail API routes
│   └── userRoutes.js        # User API routes
└── validation/
    └── trailValidation.js    # Joi validation schemas

tests/
├── alert.test.js            # Alert controller tests
├── error-handler.test.js    # Error handler tests
├── report.test.js           # Report controller tests
├── review.test.js           # Review controller tests
├── setup.js                 # Test setup and configuration
├── trail-model.test.js      # Trail model tests
├── trail.test.js            # Trail controller tests
├── user-model.test.js       # User model tests
└── user.test.js             # User controller tests
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable Firestore Database in production mode

### 2. Generate Service Account Key
- Go to Project Settings > Service Accounts
- Generate new private key
- Download the JSON file
- Extract the required values for your `.env` file

### 3. Firestore Security Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Trails/{document} {
      allow read, write: if true; // Adjust based on your needs
    }
    match /Users/{document} {
      allow read, write: if true; // Adjust based on your needs
    }
    match /{document=**} {
      allow read, write: if true; // For subcollections (reviews, alerts, reports)
    }
  }
}
```

### 4. Required Indexes
Create composite indexes in Firebase Console → Firestore Database → Indexes:

**Trails Collection:**
- `status` (Ascending), `createdAt` (Ascending)
- `difficulty` (Ascending), `createdAt` (Ascending)
- `status` (Ascending), `difficulty` (Ascending), `createdAt` (Ascending)
- `tags` (Arrays), `createdAt` (Ascending)

**Collection Group Queries:**
- `reviews` collection group: `trailId` (Ascending), `timestamp` (Ascending)
- `alerts` collection group: `trailId` (Ascending), `isActive` (Ascending)
- `reports` collection group: `status` (Ascending), `createdAt` (Ascending)

## 🚀 Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure environment variables
4. Deploy automatically on push to main branch

### Environment Variables for Production
```env
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRODUCTION_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-production-service-account@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-production-storage-bucket.appspot.com
PORT=3000
NODE_ENV=production
```

## 🔒 Security Features

- **Helmet**: Security headers for protection against common vulnerabilities
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Input Validation**: Comprehensive validation using Joi schemas
- **Error Handling**: Secure error messages (no sensitive data leaked)
- **Firebase Security**: Firestore security rules for data protection

## 🧪 Testing Your Live API

### Health Check
```bash
curl https://orion-api-qeyv.onrender.com/health
```

### Create a Trail
```bash
curl -X POST https://orion-api-qeyv.onrender.com/api/trails \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Live Test Trail",
    "location": {"latitude": 40.7128, "longitude": -74.0060},
    "distance": 3.5,
    "elevationGain": 500,
    "difficulty": "Easy",
    "description": "Testing my live API!",
    "createdBy": "live-test-user"
  }'
```

### Get All Trails
```bash
curl https://orion-api-qeyv.onrender.com/api/trails
```

### Search Trails
```bash
curl "https://orion-api-qeyv.onrender.com/api/trails/search?q=mountain"
```

### Find Trails Near Location
```bash
curl "https://orion-api-qeyv.onrender.com/api/trails/near?latitude=40.7128&longitude=-74.0060&maxDistance=10000"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow existing code style
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@orion-trails.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Authentication & Authorization system
- [ ] Image upload and management
- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] Mobile app integration
- [ ] Social features (following, sharing)
- [ ] Offline support
- [ ] Multi-language support

---

**Built with ❤️ for the hiking community**
