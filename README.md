# Orion Trail API

A comprehensive CRUD API for managing hiking trails with geolocation support, built with Node.js, Express, and Firebase Firestore.

## Features

- 🏔️ **Trail Management**: Complete CRUD operations for trails
- 📍 **Geolocation Support**: GPS coordinates, routes, and location-based search
- 🔍 **Advanced Search**: Text search, filtering, and proximity-based queries
- 📊 **Data Validation**: Comprehensive input validation using Joi
- 🔒 **Security**: Rate limiting, CORS, and security headers
- 📱 **RESTful API**: Clean, well-documented REST endpoints
- 🗄️ **Firebase Integration**: Real-time database with Firestore

## Trail Document Structure

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

## User Document Structure

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

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orion-trail-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
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

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🚀 Live API

Your API is now live at: **https://orion-api-qeyv.onrender.com**

- **Health Check:** https://orion-api-qeyv.onrender.com/health
- **API Documentation:** https://orion-api-qeyv.onrender.com/api-docs
- **Create Trail:** https://orion-api-qeyv.onrender.com/api/trails

## API Endpoints

### Trails

#### Create a Trail
```http
POST https://orion-api-qeyv.onrender.com/api/trails
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
GET https://orion-api-qeyv.onrender.com/api/trails?page=1&limit=10&difficulty=Moderate&status=open
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
GET https://orion-api-qeyv.onrender.com/api/trails/{trailId}
```

#### Update Trail
```http
PUT https://orion-api-qeyv.onrender.com/api/trails/{trailId}
Content-Type: application/json

{
  "name": "Updated Trail Name",
  "status": "maintenance"
}
```

#### Delete Trail
```http
DELETE https://orion-api-qeyv.onrender.com/api/trails/{trailId}
```

#### Search Trails by Text
```http
GET https://orion-api-qeyv.onrender.com/api/trails/search?q=mountain&difficulty=Moderate&tags=forest,views
```

**Query Parameters:**
- `q` (string, required): Search query
- `difficulty` (string): Filter by difficulty
- `tags` (string): Comma-separated tags
- `status` (string): Filter by status

#### Search Trails Near Location
```http
GET https://orion-api-qeyv.onrender.com/api/trails/near?latitude=40.7128&longitude=-74.0060&maxDistance=10000&page=1&limit=10
```

**Query Parameters:**
- `latitude` (number, required): Search latitude
- `longitude` (number, required): Search longitude
- `maxDistance` (number): Maximum distance in meters (default: 10000)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

## Response Format

All API responses follow this format:

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

## Error Codes

- `400` - Bad Request (validation errors, invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (permission denied)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting:
- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers

## Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive validation using Joi
- **Error Handling**: Secure error messages (no sensitive data leaked)

## 🧪 Testing Your Live API

### **Test with curl:**
```bash
# Health check
curl https://orion-api-qeyv.onrender.com/health

# Create a trail
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

# Get all trails
curl https://orion-api-qeyv.onrender.com/api/trails

# Search trails
curl "https://orion-api-qeyv.onrender.com/api/trails/search?q=mountain"

# Find trails near location
curl "https://orion-api-qeyv.onrender.com/api/trails/near?latitude=40.7128&longitude=-74.0060&maxDistance=10000"
```

### **Test in Browser:**
- **Health Check:** https://orion-api-qeyv.onrender.com/health
- **API Documentation:** https://orion-api-qeyv.onrender.com/api-docs

### **Test with Postman:**
1. Import this collection URL: `https://orion-api-qeyv.onrender.com/api-docs`
2. Set base URL to: `https://orion-api-qeyv.onrender.com`
3. Test all endpoints

## Development

### Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
```

### Project Structure
```
src/
├── app.js                 # Main application file
├── config/
│   └── database.js        # Firebase configuration
├── controllers/
│   └── trailController.js # Trail CRUD operations
├── middleware/
│   └── errorHandler.js    # Error handling middleware
├── models/
│   ├── Trail.js          # Trail model and validation
│   └── User.js           # User model and validation
├── routes/
│   └── trailRoutes.js    # Trail API routes
└── validation/
    └── trailValidation.js # Joi validation schemas
```

## Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Choose your preferred location

3. **Generate Service Account Key**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download the JSON file
   - Extract the required values for your `.env` file

4. **Set up Firestore Security Rules** (optional for development):
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
     }
   }
   ```

5. **Create Required Indexes** (if you get index errors):
   - Go to [Firebase Console](https://console.firebase.google.com/) → Firestore Database → Indexes
   - Create composite indexes for complex queries:
     - Collection: `Trails`
     - Fields: `status` (Ascending), `createdAt` (Ascending)
     - Fields: `difficulty` (Ascending), `createdAt` (Ascending)
     - Fields: `status` (Ascending), `difficulty` (Ascending), `createdAt` (Ascending)
     - Fields: `tags` (Arrays), `createdAt` (Ascending)
   - Or click the link provided in error messages to auto-create indexes
   - **Note:** The API will work without indexes but with limited filtering capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@orion-trails.com or create an issue in the repository.
