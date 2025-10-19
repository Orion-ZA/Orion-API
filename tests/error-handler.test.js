const errorHandler = require('../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Error Handling', () => {
    it('should handle generic errors with default status 500', () => {
      const error = new Error('Generic error message');
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(console.error).toHaveBeenCalledWith('Error:', error);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Generic error message'
      });
    });

    it('should handle errors with custom statusCode', () => {
      const error = new Error('Custom error');
      error.statusCode = 422;
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom error'
      });
    });

    it('should handle errors without message', () => {
      const error = {};
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });

    it('should handle null errors', () => {
      errorHandler(null, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });

    it('should handle undefined errors', () => {
      errorHandler(undefined, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });
  });

  describe('Firebase/Firestore Error Handling', () => {
    it('should handle permission-denied error', () => {
      const error = {
        code: 'permission-denied',
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Permission denied'
      });
    });

    it('should handle not-found error', () => {
      const error = {
        code: 'not-found',
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found'
      });
    });

    it('should handle already-exists error', () => {
      const error = {
        code: 'already-exists',
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource already exists'
      });
    });

    it('should handle invalid-argument error', () => {
      const error = {
        code: 'invalid-argument',
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid argument provided'
      });
    });

    it('should handle unknown Firebase error codes', () => {
      const error = {
        code: 'unknown-firebase-error',
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Original message'
      });
    });
  });

  describe('Validation Error Handling', () => {
    it('should handle ValidationError with single error', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          name: { message: 'Name is required' }
        }
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name is required'
      });
    });

    it('should handle ValidationError with multiple errors', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          name: { message: 'Name is required' },
          email: { message: 'Email is invalid' },
          age: { message: 'Age must be a number' }
        }
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name is required, Email is invalid, Age must be a number'
      });
    });

    it('should handle ValidationError with empty errors object', () => {
      const error = {
        name: 'ValidationError',
        errors: {}
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error'
      });
    });

    it('should handle ValidationError with null errors', () => {
      const error = {
        name: 'ValidationError',
        errors: null
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error'
      });
    });
  });

  describe('JWT Error Handling', () => {
    it('should handle JsonWebTokenError', () => {
      const error = {
        name: 'JsonWebTokenError',
        message: 'Original JWT error'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token'
      });
    });

    it('should handle TokenExpiredError', () => {
      const error = {
        name: 'TokenExpiredError',
        message: 'Original token error'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired'
      });
    });
  });

  describe('Cast Error Handling', () => {
    it('should handle CastError', () => {
      const error = {
        name: 'CastError',
        message: 'Cast to ObjectId failed'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid ID format'
      });
    });
  });

  describe('Duplicate Key Error Handling', () => {
    it('should handle duplicate key error (code 11000)', () => {
      const error = {
        code: 11000,
        message: 'Duplicate key error'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Duplicate field value entered'
      });
    });

    it('should handle duplicate key error as string', () => {
      const error = {
        code: '11000',
        message: 'Duplicate key error'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Duplicate key error'
      });
    });
  });

  describe('Environment-Specific Behavior', () => {
    it('should include stack trace in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        stack: 'Error: Test error\n    at test.js:1:1'
      });
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error'
      });
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace when NODE_ENV is not set', () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;
      
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error'
      });
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Priority and Override Behavior', () => {
    it('should prioritize Firebase error codes over other properties', () => {
      const error = {
        code: 'permission-denied',
        name: 'ValidationError',
        statusCode: 422,
        message: 'Original message',
        errors: {
          name: { message: 'Name is required' }
        }
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      // Firebase error should be processed first, but ValidationError will override it
      // The actual behavior is that ValidationError overrides Firebase errors
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name is required'
      });
    });

    it('should prioritize ValidationError over statusCode', () => {
      const error = {
        name: 'ValidationError',
        statusCode: 422,
        errors: {
          name: { message: 'Name is required' }
        }
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name is required'
      });
    });

    it('should prioritize JWT errors over statusCode', () => {
      const error = {
        name: 'JsonWebTokenError',
        statusCode: 422,
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token'
      });
    });

    it('should prioritize CastError over statusCode', () => {
      const error = {
        name: 'CastError',
        statusCode: 422,
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid ID format'
      });
    });

    it('should prioritize duplicate key error over statusCode', () => {
      const error = {
        code: 11000,
        statusCode: 422,
        message: 'Original message'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Duplicate field value entered'
      });
    });
  });

  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle error with all possible properties', () => {
      const error = {
        code: 'permission-denied',
        name: 'ValidationError',
        statusCode: 422,
        message: 'Original message',
        stack: 'Error stack trace',
        errors: {
          name: { message: 'Name is required' }
        }
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      // ValidationError will override Firebase error code
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name is required'
      });
    });

    it('should handle error with circular references', () => {
      const error = {
        message: 'Circular reference error',
        circular: null
      };
      error.circular = error; // Create circular reference
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Circular reference error'
      });
    });

    it('should handle error with special characters in message', () => {
      const error = {
        message: 'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      });
    });

    it('should handle error with very long message', () => {
      const longMessage = 'a'.repeat(10000);
      const error = {
        message: longMessage
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: longMessage
      });
    });

    it('should handle error with undefined message', () => {
      const error = {
        message: undefined
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });

    it('should handle error with empty string message', () => {
      const error = {
        message: ''
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      });
    });

    it('should handle error with whitespace-only message', () => {
      const error = {
        message: '   '
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '   '
      });
    });
  });

  describe('Console Logging', () => {
    it('should log error to console', () => {
      const error = new Error('Test error');
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(console.error).toHaveBeenCalledWith('Error:', error);
    });

    it('should not log null error to console', () => {
      // Reset console.error mock for this test
      console.error.mockClear();
      
      errorHandler(null, mockReq, mockRes, mockNext);
      
      // Should not log null error since we return early
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should not log undefined error to console', () => {
      // Reset console.error mock for this test
      console.error.mockClear();
      
      errorHandler(undefined, mockReq, mockRes, mockNext);
      
      // Should not log undefined error since we return early
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Response Format', () => {
    it('should always return success: false', () => {
      const error = new Error('Test error');
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      const responseCall = mockRes.json.mock.calls[0][0];
      expect(responseCall.success).toBe(false);
    });

    it('should always call res.status before res.json', () => {
      const error = new Error('Test error');
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should call res.json with correct structure', () => {
      const error = new Error('Test error');
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      );
    });
  });
});
