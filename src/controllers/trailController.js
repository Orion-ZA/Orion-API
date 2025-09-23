const { getDB } = require('../config/database');
const Trail = require('../models/Trail');
const { createTrailSchema, updateTrailSchema, querySchema, locationSearchSchema } = require('../validation/trailValidation');

class TrailController {
  // Create a new trail
  static async createTrail(req, res) {
    try {
      // Validate request body
      const { error, value } = createTrailSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Additional validation using Trail model
      const validationErrors = Trail.validate(value);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors
        });
      }

      const db = getDB();
      const trail = new Trail(value);
      
      // Add timestamps
      trail.createdAt = new Date();
      trail.lastUpdated = new Date();

      // Save to Firestore
      const docRef = await db.collection('trails').add(trail.toFirestore());
      
      // Get the created document
      const createdDoc = await docRef.get();
      const createdTrail = Trail.fromFirestore(createdDoc);
      
      res.status(201).json({
        success: true,
        message: 'Trail created successfully',
        data: {
          id: docRef.id,
          ...createdTrail.toFirestore()
        }
      });
    } catch (error) {
      console.error('Create trail error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all trails with pagination and filtering
  static async getTrails(req, res) {
    try {
      // Validate query parameters
      const { error, value } = querySchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.details.map(detail => detail.message)
        });
      }

      const db = getDB();
      let query = db.collection('trails');

      // Apply filters
      if (value.difficulty) {
        query = query.where('difficulty', '==', value.difficulty);
      }
      
      if (value.status) {
        query = query.where('status', '==', value.status);
      }
      
      if (value.tags) {
        const tags = value.tags.split(',').map(tag => tag.trim());
        query = query.where('tags', 'array-contains-any', tags);
      }
      
      if (value.minDistance !== undefined) {
        query = query.where('distance', '>=', value.minDistance);
      }
      
      if (value.maxDistance !== undefined) {
        query = query.where('distance', '<=', value.maxDistance);
      }
      
      if (value.minElevation !== undefined) {
        query = query.where('elevationGain', '>=', value.minElevation);
      }
      
      if (value.maxElevation !== undefined) {
        query = query.where('elevationGain', '<=', value.maxElevation);
      }

      // Apply sorting
      const sortField = value.sort;
      const sortOrder = value.order === 'asc' ? 'asc' : 'desc';
      query = query.orderBy(sortField, sortOrder);

      // Apply pagination
      const page = value.page;
      const limit = value.limit;
      const offset = (page - 1) * limit;
      
      if (offset > 0) {
        const offsetQuery = query.limit(offset);
        const offsetSnapshot = await offsetQuery.get();
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
      
      query = query.limit(limit);

      // Execute query
      const snapshot = await query.get();
      
      // Process results
      const trails = [];
      snapshot.forEach(doc => {
        const trail = Trail.fromFirestore(doc);
        trails.push({
          id: doc.id,
          ...trail.toFirestore()
        });
      });

      // Get total count for pagination info
      const countQuery = db.collection('trails');
      const countSnapshot = await countQuery.get();
      const total = countSnapshot.size;

      res.json({
        success: true,
        data: trails,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get trails error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get a single trail by ID
  static async getTrailById(req, res) {
    try {
      const { id } = req.params;
      const db = getDB();
      
      const doc = await db.collection('trails').doc(id).get();
      
      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      const trail = Trail.fromFirestore(doc);
      
      res.json({
        success: true,
        data: {
          id: doc.id,
          ...trail.toFirestore()
        }
      });
    } catch (error) {
      console.error('Get trail by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update a trail
  static async updateTrail(req, res) {
    try {
      const { id } = req.params;
      
      // Validate request body
      const { error, value } = updateTrailSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const db = getDB();
      const docRef = db.collection('trails').doc(id);
      
      // Check if trail exists
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      // Get existing trail data
      const existingTrail = Trail.fromFirestore(doc);
      
      // Merge with new data
      const updatedTrail = new Trail({
        ...existingTrail.toFirestore(),
        ...value,
        lastUpdated: new Date()
      });

      // Validate the merged data
      const validationErrors = Trail.validate(updatedTrail.toFirestore());
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors
        });
      }

      // Update in Firestore
      await docRef.update(updatedTrail.toFirestore());
      
      // Get updated document
      const updatedDoc = await docRef.get();
      const finalTrail = Trail.fromFirestore(updatedDoc);
      
      res.json({
        success: true,
        message: 'Trail updated successfully',
        data: {
          id: doc.id,
          ...finalTrail.toFirestore()
        }
      });
    } catch (error) {
      console.error('Update trail error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete a trail
  static async deleteTrail(req, res) {
    try {
      const { id } = req.params;
      const db = getDB();
      
      const docRef = db.collection('trails').doc(id);
      
      // Check if trail exists
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      // Delete the trail
      await docRef.delete();
      
      res.json({
        success: true,
        message: 'Trail deleted successfully'
      });
    } catch (error) {
      console.error('Delete trail error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Search trails near a location
  static async searchTrailsNearLocation(req, res) {
    try {
      // Validate query parameters
      const { error, value } = locationSearchSchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.details.map(detail => detail.message)
        });
      }

      const db = getDB();
      
      // Get all trails (Firestore doesn't have native geospatial queries)
      const snapshot = await db.collection('trails')
        .where('status', '==', 'open')
        .get();
      
      const trails = [];
      const { latitude, longitude, maxDistance } = value;
      
      // Filter trails by distance
      snapshot.forEach(doc => {
        const trail = Trail.fromFirestore(doc);
        const distance = Trail.calculateDistance(
          { latitude, longitude },
          trail.location
        );
        
        if (distance <= (maxDistance / 1000)) { // Convert meters to kilometers
          trails.push({
            id: doc.id,
            ...trail.toFirestore(),
            distanceFromLocation: Math.round(distance * 1000) // Convert back to meters
          });
        }
      });

      // Sort by distance
      trails.sort((a, b) => a.distanceFromLocation - b.distanceFromLocation);

      // Apply pagination
      const page = value.page;
      const limit = value.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTrails = trails.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: paginatedTrails,
        pagination: {
          page,
          limit,
          total: trails.length,
          pages: Math.ceil(trails.length / limit)
        }
      });
    } catch (error) {
      console.error('Search trails near location error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Search trails by text
  static async searchTrails(req, res) {
    try {
      const { q, difficulty, tags, status } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const db = getDB();
      let query = db.collection('trails');
      
      // Apply filters
      if (difficulty) {
        query = query.where('difficulty', '==', difficulty);
      }
      
      if (status) {
        query = query.where('status', '==', status);
      }
      
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        query = query.where('tags', 'array-contains-any', tagArray);
      }

      const snapshot = await query.get();
      
      // Filter by text search (case-insensitive)
      const searchTerm = q.toLowerCase();
      const filteredTrails = [];
      
      snapshot.forEach(doc => {
        const trail = Trail.fromFirestore(doc);
        const searchableText = `${trail.name} ${trail.description} ${trail.tags.join(' ')}`.toLowerCase();
        
        if (searchableText.includes(searchTerm)) {
          filteredTrails.push({
            id: doc.id,
            ...trail.toFirestore()
          });
        }
      });

      res.json({
        success: true,
        data: filteredTrails,
        total: filteredTrails.length
      });
    } catch (error) {
      console.error('Search trails error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = TrailController;
