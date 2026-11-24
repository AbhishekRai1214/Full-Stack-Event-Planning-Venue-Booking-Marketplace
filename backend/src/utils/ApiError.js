/**
 * ApiError – Custom Operational Error Class
 *
 * WHY a custom error class:
 * - Distinguish "operational errors" (expected: 404, 401, validation)
 *   from "programming errors" (unexpected: null reference, type mismatch)
 * - Carry HTTP status code and structured error details
 * - Enable the error handler middleware to respond appropriately
 * - Static factory methods for clean, readable error creation
 *
 * INTERVIEW QUESTION: What is the difference between operational and
 * programmer errors in Node.js?
 * - Operational: predictable, can be handled gracefully (wrong password, 404)
 * - Programmer: bugs, should crash the process and be fixed (null dereference)
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable error message
   * @param {Array} errors - Optional array of field-level errors [{field, message}]
   * @param {string} stack - Optional custom stack trace
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = true; // Mark as operational (expected) error

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ─── Static Factory Methods ───────────────────────────────────────────────

  static badRequest(message = 'Bad request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You do not have permission to perform this action') {
    return new ApiError(403, message);
  }

  static notFound(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static unprocessable(message, errors = []) {
    return new ApiError(422, message, errors);
  }

  static tooManyRequests(message = 'Too many requests. Please try again later.') {
    return new ApiError(429, message);
  }

  static internal(message = 'An unexpected error occurred') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;

