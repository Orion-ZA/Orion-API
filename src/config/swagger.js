const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orion Trail API',
      version: '1.0.0',
      description: 'A comprehensive CRUD API for managing hiking trails with geolocation support',
      contact: {
        name: 'Orion Trail API Support',
        email: 'support@orion-trails.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://your-app-name.railway.app',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        GeoPoint: {
          type: 'object',
          required: ['latitude', 'longitude'],
          properties: {
            latitude: {
              type: 'number',
              minimum: -90,
              maximum: 90,
              description: 'Latitude coordinate'
            },
            longitude: {
              type: 'number',
              minimum: -180,
              maximum: 180,
              description: 'Longitude coordinate'
            }
          }
        },
        Trail: {
          type: 'object',
          required: ['name', 'location', 'distance', 'elevationGain', 'difficulty', 'description', 'createdBy'],
          properties: {
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Trail name'
            },
            location: {
              $ref: '#/components/schemas/GeoPoint'
            },
            distance: {
              type: 'number',
              minimum: 0,
              description: 'Distance in kilometers'
            },
            elevationGain: {
              type: 'number',
              minimum: 0,
              description: 'Elevation gain in meters'
            },
            difficulty: {
              type: 'string',
              enum: ['Easy', 'Moderate', 'Hard', 'Expert'],
              description: 'Trail difficulty level'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 50
              },
              maxItems: 10,
              description: 'Array of trail tags'
            },
            gpsRoute: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/GeoPoint'
              },
              minItems: 2,
              description: 'GPS route points'
            },
            description: {
              type: 'string',
              maxLength: 2000,
              description: 'Trail description'
            },
            photos: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri'
              },
              maxItems: 20,
              description: 'Array of photo URLs'
            },
            status: {
              type: 'string',
              enum: ['open', 'closed', 'maintenance', 'seasonal'],
              default: 'open',
              description: 'Trail status'
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created the trail'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        TrailResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Trail created successfully'
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Trail document ID'
                }
              },
              allOf: [
                { $ref: '#/components/schemas/Trail' }
              ]
            }
          }
        },
        TrailListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Trail document ID'
                  }
                },
                allOf: [
                  { $ref: '#/components/schemas/Trail' }
                ]
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'number',
                  example: 1
                },
                limit: {
                  type: 'number',
                  example: 10
                },
                total: {
                  type: 'number',
                  example: 100
                },
                pages: {
                  type: 'number',
                  example: 10
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Trail name is required', 'Invalid latitude value']
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            uptime: {
              type: 'number',
              example: 123.456
            }
          }
        }
      },
      parameters: {
        TrailId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Trail document ID'
        },
        Page: {
          name: 'page',
          in: 'query',
          schema: {
            type: 'number',
            minimum: 1,
            default: 1
          },
          description: 'Page number for pagination'
        },
        Limit: {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'number',
            minimum: 1,
            maximum: 100,
            default: 10
          },
          description: 'Number of items per page'
        },
        Difficulty: {
          name: 'difficulty',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['Easy', 'Moderate', 'Hard', 'Expert']
          },
          description: 'Filter by difficulty level'
        },
        Status: {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['open', 'closed', 'maintenance', 'seasonal']
          },
          description: 'Filter by trail status'
        },
        Tags: {
          name: 'tags',
          in: 'query',
          schema: {
            type: 'string'
          },
          description: 'Comma-separated tags to filter by'
        },
        SearchQuery: {
          name: 'q',
          in: 'query',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Search query text'
        },
        Latitude: {
          name: 'latitude',
          in: 'query',
          required: true,
          schema: {
            type: 'number',
            minimum: -90,
            maximum: 90
          },
          description: 'Latitude for location-based search'
        },
        Longitude: {
          name: 'longitude',
          in: 'query',
          required: true,
          schema: {
            type: 'number',
            minimum: -180,
            maximum: 180
          },
          description: 'Longitude for location-based search'
        },
        MaxDistance: {
          name: 'maxDistance',
          in: 'query',
          schema: {
            type: 'number',
            minimum: 100,
            maximum: 100000,
            default: 10000
          },
          description: 'Maximum distance in meters for location-based search'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
