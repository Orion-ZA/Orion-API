const request = require('supertest');

// Mock the app to avoid port conflicts
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB } = require('../src/config/database');
const trailRoutes = require('../src/routes/trailRoutes');
const userRoutes = require('../src/routes/userRoutes');
const alertRoutes = require('../src/routes/alertRoutes');
const reviewRoutes = require('../src/routes/reviewRoutes');
const reportRoutes = require('../src/routes/reportRoutes');
const errorHandler = require('../src/middleware/errorHandler');

// Create test app without starting server
const createTestApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  app.use(compression());

  // Rate limiting (more lenient for tests)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Higher limit for tests
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);

  // CORS configuration
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
  }));

  // Logging (minimal for tests)
  app.use(morgan('combined'));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoints
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // API routes
  app.use('/api/trails', trailRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/reports', reportRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
};

const app = createTestApp();

describe('Trail API', () => {
  // Test data with proper MongoDB ObjectId format
  const testTrail = {
    name: 'Test Mountain Trail',
    location: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    distance: 5.2,
    elevationGain: 800,
    difficulty: 'Moderate',
    tags: ['mountain', 'views', 'forest'],
    gpsRoute: [
      { latitude: 40.7128, longitude: -74.0060 },
      { latitude: 40.7200, longitude: -74.0100 }
    ],
    description: 'A beautiful test trail with stunning mountain views and forest paths.',
    photos: ['https://example.com/photo1.jpg'],
    status: 'open',
    createdBy: global.generateFirebaseUserId() // Valid Firebase user ID format
  };

  let createdTrailId;

  // Setup and teardown
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    // Connect to database for tests
    try {
      await connectDB();
    } catch (error) {
      console.warn('Database connection failed in tests:', error.message);
    }
  });

  afterAll(async () => {
    // Clean up any test data if needed
    // Note: In a real test environment, you'd want to clean up test data
  });

  describe('POST /api/trails', () => {
    it('should create a new trail', async () => {
      const response = await request(app)
        .post('/api/trails')
        .send(testTrail)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(testTrail.name);
      expect(response.body.data.id).toBeDefined();
      
      createdTrailId = response.body.data.id;
    });

    it('should return validation error for invalid data', async () => {
      const invalidTrail = {
        name: '', // Invalid: empty name
        location: {
          latitude: 200, // Invalid: latitude out of range
          longitude: -74.0060
        },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'Test description',
        createdBy: global.generateFirebaseUserId()
      };

      const response = await request(app)
        .post('/api/trails')
        .send(invalidTrail)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/trails', () => {
    it('should get all trails', async () => {
      const response = await request(app)
        .get('/api/trails')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter trails by difficulty', async () => {
      const response = await request(app)
        .get('/api/trails?difficulty=Moderate')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach(trail => {
        expect(trail.difficulty).toBe('Moderate');
      });
    });
  });

  describe('GET /api/trails/:id', () => {
    it('should get a trail by ID', async () => {
      if (!createdTrailId) {
        // Create a trail first if not already created
        const createResponse = await request(app)
          .post('/api/trails')
          .send(testTrail);
        createdTrailId = createResponse.body.data.id;
      }

      const response = await request(app)
        .get(`/api/trails/${createdTrailId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdTrailId);
      expect(response.body.data.name).toBe(testTrail.name);
    });

    it('should return 404 for non-existent trail', async () => {
      const response = await request(app)
        .get('/api/trails/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Trail not found');
    });
  });

  describe('PUT /api/trails/:id', () => {
    it('should update a trail', async () => {
      if (!createdTrailId) {
        // Create a trail first if not already created
        const createResponse = await request(app)
          .post('/api/trails')
          .send(testTrail);
        createdTrailId = createResponse.body.data.id;
      }

      const updateData = {
        name: 'Updated Test Trail',
        status: 'maintenance'
      };

      const response = await request(app)
        .put(`/api/trails/${createdTrailId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.status).toBe(updateData.status);
    });
  });

  describe('DELETE /api/trails/:id', () => {
    it('should delete a trail', async () => {
      if (!createdTrailId) {
        // Create a trail first if not already created
        const createResponse = await request(app)
          .post('/api/trails')
          .send(testTrail);
        createdTrailId = createResponse.body.data.id;
      }

      const response = await request(app)
        .delete(`/api/trails/${createdTrailId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Trail deleted successfully');
    });
  });

  describe('GET /api/trails/search', () => {
    it('should search trails by text', async () => {
      // Create a trail first
      const createResponse = await request(app)
        .post('/api/trails')
        .send(testTrail);
      
      const response = await request(app)
        .get('/api/trails/search?q=mountain')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return 400 for missing search query', async () => {
      const response = await request(app)
        .get('/api/trails/search')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/trails/near', () => {
    it('should find trails near a location', async () => {
      // Create a trail first
      const createResponse = await request(app)
        .post('/api/trails')
        .send(testTrail);
      
      const response = await request(app)
        .get('/api/trails/near?latitude=40.7128&longitude=-74.0060&maxDistance=10000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return 400 for missing location parameters', async () => {
      const response = await request(app)
        .get('/api/trails/near')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });
});
