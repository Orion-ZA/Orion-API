const errorHandler = (err, req, res, next) => {
  // Handle null/undefined errors
  if (!err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }

  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Firebase/Firestore errors
  if (err.code === 'permission-denied') {
    const message = 'Permission denied';
    error = { message, statusCode: 403 };
  }

  if (err.code === 'not-found') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  if (err.code === 'already-exists') {
    const message = 'Resource already exists';
    error = { message, statusCode: 409 };
  }

  if (err.code === 'invalid-argument') {
    const message = 'Invalid argument provided';
    error = { message, statusCode: 400 };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = err.errors && Object.values(err.errors).map(val => val.message).join(', ') || 'Validation error';
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = { message, statusCode: 400 };
  }

  // Duplicate key errors
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
