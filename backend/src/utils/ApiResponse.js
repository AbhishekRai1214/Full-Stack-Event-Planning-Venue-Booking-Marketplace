/**
 * ApiResponse – Standardized Response Helper
 *
 * WHY: Consistent response shape across all endpoints makes the API
 * predictable for the frontend and easy to integrate with.
 *
 * All success responses follow this shape:
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": { ... },
 *   "meta": { page, limit, total, totalPages, ... }
 * }
 *
 * Usage in controllers:
 *   return ApiResponse.success(res, 'Venues fetched', venues, paginationMeta);
 *   return ApiResponse.created(res, 'Venue created', newVenue);
 */

class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }

  /**
   * Send a success response
   * @param {Response} res - Express response object
   * @param {string} message - Success message
   * @param {*} data - Response payload
   * @param {Object|null} meta - Pagination or additional metadata
   * @param {number} statusCode - HTTP status (default 200)
   */
  static success(res, message, data = null, meta = null, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, meta));
  }

  /**
   * Send a 201 Created response
   */
  static created(res, message, data = null) {
    return ApiResponse.success(res, message, data, null, 201);
  }

  /**
   * Send a 204 No Content response
   */
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;

