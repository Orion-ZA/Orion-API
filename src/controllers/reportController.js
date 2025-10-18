const { getDB } = require('../config/database');

class ReportController {
  // Get all reports with pagination and filtering
  static async getAllReports(req, res) {
    try {
      const { page = 1, limit = 10, status = 'all', type = 'all' } = req.query;
      const db = getDB();
      
      let query = db.collection('Reports');
      
      // Filter by status if specified
      if (status !== 'all') {
        query = query.where('status', '==', status);
      }
      
      // Filter by type if specified
      if (type !== 'all') {
        query = query.where('type', '==', type);
      }
      
      // Order by creation date
      query = query.orderBy('createdAt', 'desc');
      
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
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get total count
      const countSnapshot = await db.collection('Reports').get();
      const total = countSnapshot.size;

      res.json({
        success: true,
        data: reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all reports error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create a new report
  static async createReport(req, res) {
    try {
      const reportData = req.body;
      
      // Validate required fields
      const requiredFields = ['type', 'category', 'description'];
      const missingFields = requiredFields.filter(field => !reportData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          missingFields
        });
      }

      // Validate report type
      const validTypes = ['trail', 'review', 'image', 'alert', 'general'];
      if (!validTypes.includes(reportData.type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid report type',
          validTypes
        });
      }

      // Validate priority
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (reportData.priority && !validPriorities.includes(reportData.priority)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid priority level',
          validPriorities
        });
      }

      const db = getDB();
      
      // If trailId is provided, check if trail exists
      if (reportData.trailId) {
        const trailDoc = await db.collection('Trails').doc(reportData.trailId).get();
        if (!trailDoc.exists) {
          return res.status(404).json({
            success: false,
            message: 'Trail not found'
          });
        }
      }

      const report = {
        ...reportData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await db.collection('Reports').add(report);
      
      res.status(201).json({
        success: true,
        message: 'Report created successfully',
        data: {
          id: docRef.id,
          ...report
        }
      });
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update report status
  static async updateReportStatus(req, res) {
    try {
      const { reportId } = req.params;
      const { status } = req.body;
      
      if (!reportId || !status) {
        return res.status(400).json({
          success: false,
          message: 'reportId and status are required'
        });
      }

      // Validate status
      const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
          validStatuses
        });
      }

      const db = getDB();
      const reportRef = db.collection('Reports').doc(reportId);
      
      // Check if report exists
      const reportDoc = await reportRef.get();
      if (!reportDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      await reportRef.update({
        status,
        updatedAt: new Date()
      });
      
      // Get updated document
      const updatedDoc = await reportRef.get();
      
      res.json({
        success: true,
        message: 'Report status updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Update report status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update report
  static async updateReport(req, res) {
    try {
      const { reportId } = req.params;
      const updateData = req.body;
      
      if (!reportId) {
        return res.status(400).json({
          success: false,
          message: 'reportId is required'
        });
      }

      const db = getDB();
      const reportRef = db.collection('Reports').doc(reportId);
      
      // Check if report exists
      const reportDoc = await reportRef.get();
      if (!reportDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      // Validate status if provided
      if (updateData.status) {
        const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
        if (!validStatuses.includes(updateData.status)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid status',
            validStatuses
          });
        }
      }

      // Validate priority if provided
      if (updateData.priority) {
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!validPriorities.includes(updateData.priority)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid priority level',
            validPriorities
          });
        }
      }

      updateData.updatedAt = new Date();

      await reportRef.update(updateData);
      
      // Get updated document
      const updatedDoc = await reportRef.get();
      
      res.json({
        success: true,
        message: 'Report updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Update report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete report
  static async deleteReport(req, res) {
    try {
      const { reportId } = req.params;
      
      if (!reportId) {
        return res.status(400).json({
          success: false,
          message: 'reportId is required'
        });
      }

      const db = getDB();
      const reportRef = db.collection('Reports').doc(reportId);
      
      // Check if report exists
      const reportDoc = await reportRef.get();
      if (!reportDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      await reportRef.delete();
      
      res.json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      console.error('Delete report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get report by ID
  static async getReportById(req, res) {
    try {
      const { reportId } = req.params;
      
      if (!reportId) {
        return res.status(400).json({
          success: false,
          message: 'reportId is required'
        });
      }

      const db = getDB();
      const reportDoc = await db.collection('Reports').doc(reportId).get();
      
      if (!reportDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: reportDoc.id,
          ...reportDoc.data()
        }
      });
    } catch (error) {
      console.error('Get report by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get reports by user
  static async getReportsByUser(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required'
        });
      }

      const db = getDB();
      let query = db.collection('Reports')
        .where('reporterId', '==', userId)
        .orderBy('createdAt', 'desc');
      
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
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({
        success: true,
        data: reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reports.length
        }
      });
    } catch (error) {
      console.error('Get reports by user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = ReportController;
