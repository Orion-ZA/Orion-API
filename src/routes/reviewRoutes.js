const express = require('express');
const ReviewController = require('../controllers/reviewController');

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews with pagination and filtering
 *     tags: [Reviews]
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
 *         name: trailId
 *         schema:
 *           type: string
 *         description: Filter by trail ID
 *     responses:
 *       200:
 *         description: List of reviews
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
 *                     $ref: '#/components/schemas/Review'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', ReviewController.getAllReviews);

/**
 * @swagger
 * /api/reviews/trail:
 *   get:
 *     summary: Get reviews for a specific trail
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trail ID
 *     responses:
 *       200:
 *         description: List of reviews for the trail
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
 *                     $ref: '#/components/schemas/Review'
 *       400:
 *         description: trailId parameter is required
 *       404:
 *         description: Trail not found
 */
router.get('/trail', ReviewController.getTrailReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *               - review
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: ID of the trail
 *               review:
 *                 type: object
 *                 required:
 *                   - id
 *                   - userId
 *                   - userName
 *                   - rating
 *                   - comment
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique review ID
 *                   userId:
 *                     type: string
 *                     description: User ID who wrote the review
 *                   userName:
 *                     type: string
 *                     description: Display name of the user
 *                   userEmail:
 *                     type: string
 *                     description: User's email address
 *                   rating:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     description: Rating from 1 to 5
 *                   comment:
 *                     type: string
 *                     description: Review text content
 *                   message:
 *                     type: string
 *                     description: Alternative field name for comment
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Review timestamp
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of photo URLs
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Trail not found
 *       409:
 *         description: User has already reviewed this trail
 */
router.post('/', ReviewController.createReview);

/**
 * @swagger
 * /api/reviews/{trailId}/{reviewId}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trail ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */
router.get('/:trailId/:reviewId', ReviewController.getReviewById);

/**
 * @swagger
 * /api/reviews/{trailId}/{reviewId}:
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trail ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Review text content
 *               message:
 *                 type: string
 *                 description: Alternative field name for comment
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of photo URLs
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Review not found
 */
router.put('/:trailId/:reviewId', ReviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{trailId}/{reviewId}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: trailId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trail ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Review not found
 */
router.delete('/:trailId/:reviewId', ReviewController.deleteReview);

module.exports = router;
