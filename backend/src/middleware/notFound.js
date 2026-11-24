/**
 * 404 Not Found Middleware
 *
 * Catches all requests that don't match any defined routes.
 * Must be placed AFTER all route definitions and BEFORE errorHandler.
 */

const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}. Check the API documentation.`
    )
  );
};

module.exports = { notFound };

