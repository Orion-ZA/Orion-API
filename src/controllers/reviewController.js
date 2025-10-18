const { getDB } = require('../config/database');

class ReviewController {
  // Get all reviews for a specific trail
  static async getTrailReviews(req, res) {
    try {
      const { trailId } = req.query;
      
      if (!trailId) {
        return res.status(400).json({
          success: false,
          message: 'trailId query parameter is required'
        });
      }

      const db = getDB();
      
      // Check if trail exists
      const trailDoc = await db.collection('Trails').doc(trailId).get();
      if (!trailDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      const reviewsSnapshot = await db.collection('Trails')
        .doc(trailId)
        .collection('reviews')
        .orderBy('timestamp', 'desc')
        .get();

      const reviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Get trail reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create a new review
  static async createReview(req, res) {
    try {
      const { trailId, review } = req.body;
      
      if (!trailId || !review) {
        return res.status(400).json({
          success: false,
          message: 'trailId and review are required'
        });
      }

      // Validate review data
      const requiredFields = ['id', 'userId', 'userName', 'rating', 'comment'];
      const missingFields = requiredFields.filter(field => !review[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          missingFields
        });
      }

      // Validate rating
      if (review.rating < 1 || review.rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const db = getDB();
      
      // Check if trail exists
      const trailDoc = await db.collection('Trails').doc(trailId).get();
      if (!trailDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      // Check if user already reviewed this trail
      const existingReview = await db.collection('Trails')
        .doc(trailId)
        .collection('reviews')
        .where('userId', '==', review.userId)
        .get();

      if (!existingReview.empty) {
        return res.status(409).json({
          success: false,
          message: 'User has already reviewed this trail'
        });
      }

      // Add timestamp if not provided
      const reviewData = {
        ...review,
        timestamp: review.timestamp || new Date().toISOString()
      };

      const reviewRef = db.collection('Trails')
        .doc(trailId)
        .collection('reviews')
        .doc(review.id);
      
      await reviewRef.set(reviewData);
      
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: {
          id: reviewRef.id,
          ...reviewData
        }
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update a review
  static async updateReview(req, res) {
    try {
      const { trailId, reviewId } = req.params;
      const updateData = req.body;
      
      if (!trailId || !reviewId) {
        return res.status(400).json({
          success: false,
          message: 'trailId and reviewId are required'
        });
      }

      const db = getDB();
      
      // Check if trail exists
      const trailDoc = await db.collection('Trails').doc(trailId).get();
      if (!trailDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      const reviewRef = db.collection('Trails')
        .doc(trailId)
        .collection('reviews')
        .doc(reviewId);
      
      // Check if review exists
      const reviewDoc = await reviewRef.get();
      if (!reviewDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Validate rating if provided
      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Add last updated timestamp
      updateData.lastUpdated = new Date().toISOString();

      await reviewRef.update(updateData);
      
      // Get updated document
      const updatedDoc = await reviewRef.get();
      
      res.json({
        success: true,
        message: 'Review updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete a review
  static async deleteReview(req, res) {
    try {
      const { trailId, reviewId } = req.params;
      
      if (!trailId || !reviewId) {
        return res.status(400).json({
          success: false,
          message: 'trailId and reviewId are required'
        });
      }

      const db = getDB();
      
      // Check if trail exists
      const trailDoc = await db.collection('Trails').doc(trailId).get();
      if (!trailDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      const reviewRef = db.collection('Trails')
        .doc(trailId)
        .collection('reviews')
        .doc(reviewId);
      
      // Check if review exists
      const reviewDoc = await reviewRef.get();
      if (!reviewDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      await reviewRef.delete();
      
      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get review by ID
  static async getReviewById(req, res) {
    try {
      const { trailId, reviewId } = req.params;
      
      if (!trailId || !reviewId) {
        return res.status(400).json({
          success: false,
          message: 'trailId and reviewId are required'
        });
      }

      const db = getDB();
      
      const reviewDoc = await db.collection('Trails')
        .doc(trailId)
        .collection('reviews')
        .doc(reviewId)
        .get();
      
      if (!reviewDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: reviewDoc.id,
          ...reviewDoc.data()
        }
      });
    } catch (error) {
      console.error('Get review by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all reviews (admin)
  static async getAllReviews(req, res) {
    try {
      const { page = 1, limit = 10, trailId } = req.query;
      const db = getDB();
      
      let query = db.collectionGroup('reviews');
      
      // Filter by trail if specified
      if (trailId) {
        query = query.where('trailId', '==', trailId);
      }
      
      // Order by timestamp
      query = query.orderBy('timestamp', 'desc');
      
      // Apply pagination
      const offset = (page - 1) * limit;
      if (offset > 0) {
        const offsetQuery = query.limit(offset);
        const offsetSnapshot = await offsetQuery.get();
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
      
      query = query.limit(parseInt(limit));
      
      const snapshot = await query.get();
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({
        success: true,
        data: reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reviews.length // Note: This is approximate for collection group queries
        }
      });
    } catch (error) {
      console.error('Get all reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = ReviewController;
