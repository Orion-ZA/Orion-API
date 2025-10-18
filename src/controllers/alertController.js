const { getDB } = require('../config/database');

class AlertController {
  // Get all alerts for a specific trail
  static async getTrailAlerts(req, res) {
    try {
      const { trailId } = req.query;
      
      if (!trailId) {
        return res.status(400).json({
          success: false,
          message: 'trailId query parameter is required'
        });
      }

      const db = getDB();
      const snapshot = await db.collection('Alerts')
        .where('trailId', '==', trailId)
        .where('isActive', '==', true)
        .orderBy('timestamp', 'desc')
        .get();

      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Get trail alerts error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all alerts (admin)
  static async getAllAlerts(req, res) {
    try {
      const { page = 1, limit = 10, status = 'all' } = req.query;
      const db = getDB();
      
      let query = db.collection('Alerts');
      
      // Filter by status if specified
      if (status !== 'all') {
        if (status === 'active') {
          query = query.where('isActive', '==', true);
        } else if (status === 'inactive') {
          query = query.where('isActive', '==', false);
        }
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
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get total count
      const countSnapshot = await db.collection('Alerts').get();
      const total = countSnapshot.size;

      res.json({
        success: true,
        data: alerts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all alerts error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create a new alert
  static async createAlert(req, res) {
    try {
      const { trailId, message, type, comment, isTimed, duration } = req.body;
      
      if (!trailId || !message || !type) {
        return res.status(400).json({
          success: false,
          message: 'trailId, message, and type are required'
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

      const alertData = {
        trailId,
        message,
        type,
        comment: comment || '',
        isActive: true,
        timestamp: new Date(),
        isTimed: isTimed || false
      };

      // Add expiration if it's a timed alert
      if (isTimed && duration) {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + duration);
        alertData.expiresAt = expiresAt;
      }

      const docRef = await db.collection('Alerts').add(alertData);
      
      res.status(201).json({
        success: true,
        message: 'Alert created successfully',
        data: {
          id: docRef.id,
          ...alertData
        }
      });
    } catch (error) {
      console.error('Create alert error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update alert status
  static async updateAlert(req, res) {
    try {
      const { alertId } = req.params;
      const { isActive, message, type, comment } = req.body;
      
      if (!alertId) {
        return res.status(400).json({
          success: false,
          message: 'alertId is required'
        });
      }

      const db = getDB();
      const alertRef = db.collection('Alerts').doc(alertId);
      
      // Check if alert exists
      const alertDoc = await alertRef.get();
      if (!alertDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }

      const updateData = {};
      if (isActive !== undefined) updateData.isActive = isActive;
      if (message) updateData.message = message;
      if (type) updateData.type = type;
      if (comment !== undefined) updateData.comment = comment;
      
      updateData.lastUpdated = new Date();

      await alertRef.update(updateData);
      
      // Get updated document
      const updatedDoc = await alertRef.get();
      
      res.json({
        success: true,
        message: 'Alert updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Update alert error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete alert
  static async deleteAlert(req, res) {
    try {
      const { alertId } = req.params;
      
      if (!alertId) {
        return res.status(400).json({
          success: false,
          message: 'alertId is required'
        });
      }

      const db = getDB();
      const alertRef = db.collection('Alerts').doc(alertId);
      
      // Check if alert exists
      const alertDoc = await alertRef.get();
      if (!alertDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }

      await alertRef.delete();
      
      res.json({
        success: true,
        message: 'Alert deleted successfully'
      });
    } catch (error) {
      console.error('Delete alert error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get alert by ID
  static async getAlertById(req, res) {
    try {
      const { alertId } = req.params;
      
      if (!alertId) {
        return res.status(400).json({
          success: false,
          message: 'alertId is required'
        });
      }

      const db = getDB();
      const alertDoc = await db.collection('Alerts').doc(alertId).get();
      
      if (!alertDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: alertDoc.id,
          ...alertDoc.data()
        }
      });
    } catch (error) {
      console.error('Get alert by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = AlertController;
