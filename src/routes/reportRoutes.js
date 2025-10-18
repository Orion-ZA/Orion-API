const express = require('express');
const ReportController = require('../controllers/reportController');

const router = express.Router();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports with pagination and filtering
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, reviewed, resolved, dismissed]
 *           default: all
 *         description: Filter by report status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, trail, review, image, alert, general]
 *           default: all
 *         description: Filter by report type
 *     responses:
 *       200:
 *         description: List of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', ReportController.getAllReports);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - category
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [trail, review, image, alert, general]
 *                 description: Type of report
 *               category:
 *                 type: string
 *                 description: Specific category based on report type
 *               description:
 *                 type: string
 *                 description: Detailed description of the issue
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *                 description: Priority level
 *               additionalDetails:
 *                 type: string
 *                 description: Optional additional information
 *               targetId:
 *                 type: string
 *                 description: ID of the specific item being reported
 *               trailId:
 *                 type: string
 *                 description: ID of the associated trail
 *               trailName:
 *                 type: string
 *                 description: Name of the trail for reference
 *               reporterId:
 *                 type: string
 *                 description: Firebase Auth UID of the user who submitted the report
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Trail not found (if trailId provided)
 */
router.post('/', ReportController.createReport);

/**
 * @swagger
 * /api/reports/{reportId}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report not found
 */
router.get('/:reportId', ReportController.getReportById);

/**
 * @swagger
 * /api/reports/{reportId}/status:
 *   put:
 *     summary: Update report status
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, resolved, dismissed]
 *                 description: New status for the report
 *     responses:
 *       200:
 *         description: Report status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Report not found
 */
router.put('/:reportId/status', ReportController.updateReportStatus);

/**
 * @swagger
 * /api/reports/{reportId}:
 *   put:
 *     summary: Update report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, resolved, dismissed]
 *                 description: Report status
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 description: Priority level
 *               description:
 *                 type: string
 *                 description: Report description
 *               additionalDetails:
 *                 type: string
 *                 description: Additional details
 *               category:
 *                 type: string
 *                 description: Report category
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Report not found
 */
router.put('/:reportId', ReportController.updateReport);

/**
 * @swagger
 * /api/reports/{reportId}:
 *   delete:
 *     summary: Delete report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Report not found
 */
router.delete('/:reportId', ReportController.deleteReport);

/**
 * @swagger
 * /api/reports/user/{userId}:
 *   get:
 *     summary: Get reports by user
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of reports by user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: userId is required
 */
router.get('/user/:userId', ReportController.getReportsByUser);

module.exports = router;
