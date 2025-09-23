const Joi = require('joi');

// GeoPoint validation schema
const geoPointSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required()
    .messages({
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  longitude: Joi.number().min(-180).max(180).required()
    .messages({
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    })
});

// Trail creation validation schema
const createTrailSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'Trail name is required',
      'string.min': 'Trail name must be at least 1 character',
      'string.max': 'Trail name cannot exceed 100 characters',
      'any.required': 'Trail name is required'
    }),
  location: geoPointSchema.required()
    .messages({
      'any.required': 'Trail location is required'
    }),
  distance: Joi.number().min(0).required()
    .messages({
      'number.min': 'Distance must be positive',
      'any.required': 'Trail distance is required'
    }),
  elevationGain: Joi.number().min(0).required()
    .messages({
      'number.min': 'Elevation gain must be positive',
      'any.required': 'Elevation gain is required'
    }),
  difficulty: Joi.string().valid('Easy', 'Moderate', 'Hard', 'Expert').required()
    .messages({
      'any.only': 'Difficulty must be one of: Easy, Moderate, Hard, Expert',
      'any.required': 'Difficulty level is required'
    }),
  tags: Joi.array().items(
    Joi.string().trim().max(50)
  ).max(10)
    .messages({
      'array.max': 'Cannot have more than 10 tags',
      'string.max': 'Tag cannot exceed 50 characters'
    }),
  gpsRoute: Joi.array().items(geoPointSchema).min(2)
    .messages({
      'array.min': 'GPS route must have at least 2 points'
    }),
  description: Joi.string().trim().min(1).max(2000).required()
    .messages({
      'string.empty': 'Trail description is required',
      'string.min': 'Description must be at least 1 character',
      'string.max': 'Description cannot exceed 2000 characters',
      'any.required': 'Trail description is required'
    }),
  photos: Joi.array().items(
    Joi.string().uri()
  ).max(20)
    .messages({
      'array.max': 'Cannot have more than 20 photos',
      'string.uri': 'Photo must be a valid URL'
    }),
  status: Joi.string().valid('open', 'closed', 'maintenance', 'seasonal')
    .default('open')
    .messages({
      'any.only': 'Status must be one of: open, closed, maintenance, seasonal'
    }),
  createdBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid user ID format'
    })
});

// Trail update validation schema
const updateTrailSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100)
    .messages({
      'string.empty': 'Trail name cannot be empty',
      'string.min': 'Trail name must be at least 1 character',
      'string.max': 'Trail name cannot exceed 100 characters'
    }),
  location: geoPointSchema,
  distance: Joi.number().min(0)
    .messages({
      'number.min': 'Distance must be positive'
    }),
  elevationGain: Joi.number().min(0)
    .messages({
      'number.min': 'Elevation gain must be positive'
    }),
  difficulty: Joi.string().valid('Easy', 'Moderate', 'Hard', 'Expert')
    .messages({
      'any.only': 'Difficulty must be one of: Easy, Moderate, Hard, Expert'
    }),
  tags: Joi.array().items(
    Joi.string().trim().max(50)
  ).max(10)
    .messages({
      'array.max': 'Cannot have more than 10 tags',
      'string.max': 'Tag cannot exceed 50 characters'
    }),
  gpsRoute: Joi.array().items(geoPointSchema).min(2)
    .messages({
      'array.min': 'GPS route must have at least 2 points'
    }),
  description: Joi.string().trim().min(1).max(2000)
    .messages({
      'string.empty': 'Trail description cannot be empty',
      'string.min': 'Description must be at least 1 character',
      'string.max': 'Description cannot exceed 2000 characters'
    }),
  photos: Joi.array().items(
    Joi.string().uri()
  ).max(20)
    .messages({
      'array.max': 'Cannot have more than 20 photos',
      'string.uri': 'Photo must be a valid URL'
    }),
  status: Joi.string().valid('open', 'closed', 'maintenance', 'seasonal')
    .messages({
      'any.only': 'Status must be one of: open, closed, maintenance, seasonal'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Query parameters validation schema
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('name', 'distance', 'elevationGain', 'createdAt', 'lastUpdated').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  difficulty: Joi.string().valid('Easy', 'Moderate', 'Hard', 'Expert'),
  status: Joi.string().valid('open', 'closed', 'maintenance', 'seasonal'),
  tags: Joi.string(), // Comma-separated tags
  search: Joi.string().trim().max(100),
  minDistance: Joi.number().min(0),
  maxDistance: Joi.number().min(0),
  minElevation: Joi.number().min(0),
  maxElevation: Joi.number().min(0)
});

// Location-based search validation schema
const locationSearchSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  maxDistance: Joi.number().min(100).max(100000).default(10000), // in meters
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

// Review validation schema
const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required()
    .messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    }),
  comment: Joi.string().trim().max(1000)
    .messages({
      'string.max': 'Comment cannot exceed 1000 characters'
    })
});

module.exports = {
  createTrailSchema,
  updateTrailSchema,
  querySchema,
  locationSearchSchema,
  reviewSchema
};
