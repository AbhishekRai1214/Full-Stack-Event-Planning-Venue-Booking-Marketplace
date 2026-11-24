/**
 * Global Error Handler Middleware
 *
 * This is the LAST middleware in the Express chain.
 * All errors passed via next(err) end up here.
 *
 * WHY centralized error handling:
 * - Consistent error response format across all endpoints
 * - Single place to handle Mongoose, JWT, and custom errors
 * - Production vs development error detail control
 * - Proper logging of server errors
 *
 * Error types handled:
 * 1. ApiError (our custom errors – operational)
 * 2. Mongoose ValidationError (schema validation failures)
 * 3. Mongoose CastError (invalid ObjectId format)
 * 4. Mongoose duplicate key error (code 11000)
 * 5. JWT errors (JsonWebTokenError, TokenExpiredError)
 * 6. Unknown errors (catch-all, hide details in production)
 */

const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // ─── Log the error ──────────────────────────────────────────────────────────
  if (!err.isOperational || err.statusCode >= 500) {
    // Unexpected / server errors – log with full details
    logger.error({ err, reqId: req.id, path: req.path }, 'Unexpected server error');
  } else {
    // Expected operational errors – log lightly
    logger.warn(
      { status: err.statusCode, message: err.message, path: req.path },
      'Operational error'
    );
  }

  // ─── Mongoose: Schema Validation Error ─────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // ─── Mongoose: Duplicate Key Error ─────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue?.[field];
    return res.status(409).json({
      success: false,
      message: `${field} '${value}' already exists`,
      errors: [{ field, message: `This ${field} is already taken` }],
    });
  }

  // ─── Mongoose: Invalid ObjectId ────────────────────────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: '${err.value}' is not a valid ID`,
    });
  }

  // ─── JWT: Invalid Token ────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }

  // ─── JWT: Expired Token ────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired. Please login again.',
    });
  }

  // ─── Our Custom ApiError ───────────────────────────────────────────────────
  if (err instanceof ApiError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors?.length && { errors: err.errors }),
    });
  }

  // ─── Unknown / Unexpected Errors ───────────────────────────────────────────
  // Never expose internal details in production
  const statusCode = err.statusCode || 500;
  const message = isDev ? err.message : 'An unexpected error occurred. Please try again.';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

