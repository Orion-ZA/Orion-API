const express = require('express');
const AlertController = require('../controllers/alertController');

const router = express.Router();

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get all alerts with pagination and filtering
 *     tags: [Alerts]
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
 *           enum: [all, active, inactive]
 *           default: all
 *         description: Filter by alert status
 *     responses:
 *       200:
 *         description: List of alerts
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
 *                     $ref: '#/components/schemas/Alert'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', AlertController.getAllAlerts);

/**
 * @swagger
 * /api/alerts/trail:
 *   get:
 *     summary: Get alerts for a specific trail
 *     tags: [Alerts]
 *     parameters:
 *       - in: query
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trail ID
 *     responses:
 *       200:
 *         description: List of active alerts for the trail
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
 *                     $ref: '#/components/schemas/Alert'
 *       400:
 *         description: trailId parameter is required
 */
router.get('/trail', AlertController.getTrailAlerts);

/**
 * @swagger
 * /api/alerts:
 *   post:
 *     summary: Create a new alert
 *     tags: [Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *               - message
 *               - type
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: ID of the trail
 *               message:
 *                 type: string
 *                 description: Alert message
 *               type:
 *                 type: string
 *                 enum: [community, authority, emergency]
 *                 description: Type of alert
 *               comment:
 *                 type: string
 *                 description: Additional comment
 *               isTimed:
 *                 type: boolean
 *                 description: Whether this is a timed alert
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes (for timed alerts)
 *     responses:
 *       201:
 *         description: Alert created successfully
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
 *                   $ref: '#/components/schemas/Alert'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Trail not found
 */
router.post('/', AlertController.createAlert);

/**
 * @swagger
 * /api/alerts/{alertId}:
 *   get:
 *     summary: Get alert by ID
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Alert ID
 *     responses:
 *       200:
 *         description: Alert details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Alert'
 *       404:
 *         description: Alert not found
 */
router.get('/:alertId', AlertController.getAlertById);

/**
 * @swagger
 * /api/alerts/{alertId}:
 *   put:
 *     summary: Update alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Alert ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: Whether the alert is active
 *               message:
 *                 type: string
 *                 description: Alert message
 *               type:
 *                 type: string
 *                 enum: [community, authority, emergency]
 *                 description: Type of alert
 *               comment:
 *                 type: string
 *                 description: Additional comment
 *     responses:
 *       200:
 *         description: Alert updated successfully
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
 *                   $ref: '#/components/schemas/Alert'
 *       404:
 *         description: Alert not found
 */
router.put('/:alertId', AlertController.updateAlert);

/**
 * @swagger
 * /api/alerts/{alertId}:
 *   delete:
 *     summary: Delete alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Alert ID
 *     responses:
 *       200:
 *         description: Alert deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Alert not found
 */
router.delete('/:alertId', AlertController.deleteAlert);

module.exports = router;
