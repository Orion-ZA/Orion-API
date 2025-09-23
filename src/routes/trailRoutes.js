const express = require('express');
const TrailController = require('../controllers/trailController');

const router = express.Router();

/**
 * @swagger
 * /api/trails:
 *   post:
 *     summary: Create a new trail
 *     tags: [Trails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trail'
 *     responses:
 *       201:
 *         description: Trail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrailResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', TrailController.createTrail);

/**
 * @swagger
 * /api/trails:
 *   get:
 *     summary: Get all trails with pagination and filtering
 *     tags: [Trails]
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Difficulty'
 *       - $ref: '#/components/parameters/Status'
 *       - $ref: '#/components/parameters/Tags'
 *     responses:
 *       200:
 *         description: List of trails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrailListResponse'
 */
router.get('/', TrailController.getTrails);

/**
 * @swagger
 * /api/trails/search:
 *   get:
 *     summary: Search trails by text
 *     tags: [Trails]
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/Difficulty'
 *       - $ref: '#/components/parameters/Status'
 *       - $ref: '#/components/parameters/Tags'
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrailListResponse'
 */
router.get('/search', TrailController.searchTrails);

/**
 * @swagger
 * /api/trails/near:
 *   get:
 *     summary: Find trails near a location
 *     tags: [Trails]
 *     parameters:
 *       - $ref: '#/components/parameters/Latitude'
 *       - $ref: '#/components/parameters/Longitude'
 *       - $ref: '#/components/parameters/MaxDistance'
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Trails near the specified location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrailListResponse'
 */
router.get('/near', TrailController.searchTrailsNearLocation);

/**
 * @swagger
 * /api/trails/{id}:
 *   get:
 *     summary: Get a trail by ID
 *     tags: [Trails]
 *     parameters:
 *       - $ref: '#/components/parameters/TrailId'
 *     responses:
 *       200:
 *         description: Trail details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrailResponse'
 *       404:
 *         description: Trail not found
 */
router.get('/:id', TrailController.getTrailById);

/**
 * @swagger
 * /api/trails/{id}:
 *   put:
 *     summary: Update a trail
 *     tags: [Trails]
 *     parameters:
 *       - $ref: '#/components/parameters/TrailId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, closed, maintenance, seasonal]
 *     responses:
 *       200:
 *         description: Trail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrailResponse'
 *       404:
 *         description: Trail not found
 */
router.put('/:id', TrailController.updateTrail);

/**
 * @swagger
 * /api/trails/{id}:
 *   delete:
 *     summary: Delete a trail
 *     tags: [Trails]
 *     parameters:
 *       - $ref: '#/components/parameters/TrailId'
 *     responses:
 *       200:
 *         description: Trail deleted successfully
 *       404:
 *         description: Trail not found
 */
router.delete('/:id', TrailController.deleteTrail);

module.exports = router;
