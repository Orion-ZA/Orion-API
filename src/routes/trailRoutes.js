const express = require('express');
const TrailController = require('../controllers/trailController');

const router = express.Router();

// @route   POST /api/trails
// @desc    Create a new trail
// @access  Public (you can add authentication middleware later)
router.post('/', TrailController.createTrail);

// @route   GET /api/trails
// @desc    Get all trails with pagination and filtering
// @access  Public
router.get('/', TrailController.getTrails);

// @route   GET /api/trails/search
// @desc    Search trails by text
// @access  Public
router.get('/search', TrailController.searchTrails);

// @route   GET /api/trails/near
// @desc    Search trails near a location
// @access  Public
router.get('/near', TrailController.searchTrailsNearLocation);

// @route   GET /api/trails/:id
// @desc    Get a single trail by ID
// @access  Public
router.get('/:id', TrailController.getTrailById);

// @route   PUT /api/trails/:id
// @desc    Update a trail
// @access  Public (you can add authentication middleware later)
router.put('/:id', TrailController.updateTrail);

// @route   DELETE /api/trails/:id
// @desc    Delete a trail
// @access  Public (you can add authentication middleware later)
router.delete('/:id', TrailController.deleteTrail);

module.exports = router;
