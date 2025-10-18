const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /api/users/{userId}/favorites:
 *   post:
 *     summary: Add trail to user's favorites
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: Trail ID to add to favorites
 *     responses:
 *       200:
 *         description: Trail added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Trail not found
 */
router.post('/:userId/favorites', UserController.addFavorite);

/**
 * @swagger
 * /api/users/{userId}/favorites:
 *   delete:
 *     summary: Remove trail from user's favorites
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: Trail ID to remove from favorites
 *     responses:
 *       200:
 *         description: Trail removed from favorites successfully
 */
router.delete('/:userId/favorites', UserController.removeFavorite);

/**
 * @swagger
 * /api/users/{userId}/wishlist:
 *   post:
 *     summary: Add trail to user's wishlist
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: Trail ID to add to wishlist
 *     responses:
 *       200:
 *         description: Trail added to wishlist successfully
 */
router.post('/:userId/wishlist', UserController.addWishlist);

/**
 * @swagger
 * /api/users/{userId}/wishlist:
 *   delete:
 *     summary: Remove trail from user's wishlist
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: Trail ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Trail removed from wishlist successfully
 */
router.delete('/:userId/wishlist', UserController.removeWishlist);

/**
 * @swagger
 * /api/users/{userId}/completed:
 *   post:
 *     summary: Mark trail as completed
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: Trail ID to mark as completed
 *     responses:
 *       200:
 *         description: Trail marked as completed successfully
 */
router.post('/:userId/completed', UserController.markCompleted);

/**
 * @swagger
 * /api/users/{userId}/completed:
 *   delete:
 *     summary: Remove trail from completed list
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trailId
 *             properties:
 *               trailId:
 *                 type: string
 *                 description: Trail ID to remove from completed
 *     responses:
 *       200:
 *         description: Trail removed from completed successfully
 */
router.delete('/:userId/completed', UserController.removeCompleted);

/**
 * @swagger
 * /api/users/{userId}/saved-trails:
 *   get:
 *     summary: Get user's saved trails (favorites, wishlist, completed)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's saved trails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     favourites:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Trail'
 *                     wishlist:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Trail'
 *                     completed:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Trail'
 *       404:
 *         description: User not found
 */
router.get('/:userId/saved-trails', UserController.getSavedTrails);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 */
router.get('/:userId', UserController.getUserProfile);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileInfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   joinedDate:
 *                     type: string
 *                     format: date-time
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 */
router.put('/:userId', UserController.updateUserProfile);

module.exports = router;
