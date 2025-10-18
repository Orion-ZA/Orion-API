const { getDB } = require('../config/database');

class UserController {
  // Add trail to user's favorites
  static async addFavorite(req, res) {
    try {
      const { userId, trailId } = req.body;
      
      if (!userId || !trailId) {
        return res.status(400).json({
          success: false,
          message: 'userId and trailId are required'
        });
      }

      const db = getDB();
      const userRef = db.collection('Users').doc(userId);
      const trailRef = db.collection('Trails').doc(trailId);

      // Check if trail exists
      const trailDoc = await trailRef.get();
      if (!trailDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      // Add to favourites array
      await userRef.update({
        favourites: db.FieldValue.arrayUnion(trailRef)
      });

      res.json({
        success: true,
        message: 'Trail added to favourites successfully'
      });
    } catch (error) {
      console.error('Add favorite error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Remove trail from user's favorites
  static async removeFavorite(req, res) {
    try {
      const { userId, trailId } = req.body;
      
      if (!userId || !trailId) {
        return res.status(400).json({
          success: false,
          message: 'userId and trailId are required'
        });
      }

      const db = getDB();
      const userRef = db.collection('Users').doc(userId);
      const trailRef = db.collection('Trails').doc(trailId);

      await userRef.update({
        favourites: db.FieldValue.arrayRemove(trailRef)
      });

      res.json({
        success: true,
        message: 'Trail removed from favourites successfully'
      });
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Add trail to user's wishlist
  static async addWishlist(req, res) {
    try {
      const { userId, trailId } = req.body;
      
      if (!userId || !trailId) {
        return res.status(400).json({
          success: false,
          message: 'userId and trailId are required'
        });
      }

      const db = getDB();
      const userRef = db.collection('Users').doc(userId);
      const trailRef = db.collection('Trails').doc(trailId);

      // Check if trail exists
      const trailDoc = await trailRef.get();
      if (!trailDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      await userRef.update({
        wishlist: db.FieldValue.arrayUnion(trailRef)
      });

      res.json({
        success: true,
        message: 'Trail added to wishlist successfully'
      });
    } catch (error) {
      console.error('Add wishlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Remove trail from user's wishlist
  static async removeWishlist(req, res) {
    try {
      const { userId, trailId } = req.body;
      
      if (!userId || !trailId) {
        return res.status(400).json({
          success: false,
          message: 'userId and trailId are required'
        });
      }

      const db = getDB();
      const userRef = db.collection('Users').doc(userId);
      const trailRef = db.collection('Trails').doc(trailId);

      await userRef.update({
        wishlist: db.FieldValue.arrayRemove(trailRef)
      });

      res.json({
        success: true,
        message: 'Trail removed from wishlist successfully'
      });
    } catch (error) {
      console.error('Remove wishlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Mark trail as completed
  static async markCompleted(req, res) {
    try {
      const { userId, trailId } = req.body;
      
      if (!userId || !trailId) {
        return res.status(400).json({
          success: false,
          message: 'userId and trailId are required'
        });
      }

      const db = getDB();
      const userRef = db.collection('Users').doc(userId);
      const trailRef = db.collection('Trails').doc(trailId);

      // Check if trail exists
      const trailDoc = await trailRef.get();
      if (!trailDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Trail not found'
        });
      }

      // Add to completed and remove from favorites/wishlist
      await userRef.update({
        completed: db.FieldValue.arrayUnion(trailRef),
        favourites: db.FieldValue.arrayRemove(trailRef),
        wishlist: db.FieldValue.arrayRemove(trailRef)
      });

      res.json({
        success: true,
        message: 'Trail marked as completed successfully'
      });
    } catch (error) {
      console.error('Mark completed error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Remove trail from completed
  static async removeCompleted(req, res) {
    try {
      const { userId, trailId } = req.body;
      
      if (!userId || !trailId) {
        return res.status(400).json({
          success: false,
          message: 'userId and trailId are required'
        });
      }

      const db = getDB();
      const userRef = db.collection('Users').doc(userId);
      const trailRef = db.collection('Trails').doc(trailId);

      await userRef.update({
        completed: db.FieldValue.arrayRemove(trailRef)
      });

      res.json({
        success: true,
        message: 'Trail removed from completed successfully'
      });
    } catch (error) {
      console.error('Remove completed error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get user's saved trails (favorites, wishlist, completed)
  static async getSavedTrails(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required'
        });
      }

      const db = getDB();
      const userDoc = await db.collection('Users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userData = userDoc.data();

      // Helper function to resolve trail references
      const resolveTrails = async (refs) => {
        if (!refs || refs.length === 0) return [];
        const snapshots = await Promise.all(refs.map(ref => ref.get()));
        return snapshots.filter(s => s.exists).map(s => ({ 
          id: s.id, 
          ...s.data() 
        }));
      };

      const [favourites, wishlist, completed] = await Promise.all([
        resolveTrails(userData.favourites || []),
        resolveTrails(userData.wishlist || []),
        resolveTrails(userData.completed || [])
      ]);

      res.json({
        success: true,
        data: {
          favourites,
          wishlist,
          completed
        }
      });
    } catch (error) {
      console.error('Get saved trails error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get user profile
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required'
        });
      }

      const db = getDB();
      const userDoc = await db.collection('Users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: userDoc.id,
          ...userDoc.data()
        }
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update user profile
  static async updateUserProfile(req, res) {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required'
        });
      }

      const db = getDB();
      const userRef = db.collection('Users').doc(userId);
      
      // Check if user exists
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user data
      await userRef.update(updateData);
      
      // Get updated document
      const updatedDoc = await userRef.get();
      
      res.json({
        success: true,
        message: 'User profile updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
