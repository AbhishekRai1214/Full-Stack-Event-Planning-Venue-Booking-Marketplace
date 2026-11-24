/**
 * Pagination Utilities
 *
 * WHY centralized pagination:
 * - Consistent page/limit handling across all list endpoints
 * - Prevents clients from requesting unreasonably large pages (DoS prevention)
 * - Reusable across all repository methods
 *
 * Usage:
 *   const { page, limit, skip } = getPaginationParams(req.query);
 *   const venues = await Venue.find(filter).skip(skip).limit(limit);
 *   const total = await Venue.countDocuments(filter);
 *   const meta = getPaginationMeta(total, page, limit);
 *   return ApiResponse.success(res, 'Venues fetched', venues, meta);
 */

/**
 * Extract and validate pagination parameters from query string
 * @param {Object} query - Express req.query object
 * @param {number} defaultLimit - Default items per page (default: 12)
 * @param {number} maxLimit - Maximum allowed items per page (default: 50)
 * @returns {{ page: number, limit: number, skip: number }}
 */
const getPaginationParams = (query, defaultLimit = 12, maxLimit = 50) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build pagination metadata for response
 * @param {number} total - Total documents matching the query
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Build a sort object from query parameters
 * @param {Object} query - Express req.query
 * @param {string[]} allowedFields - Whitelist of sortable fields
 * @param {string} defaultField - Default sort field
 * @param {'asc'|'desc'} defaultOrder - Default sort direction
 * @returns {Object} Mongoose sort object e.g. { createdAt: -1 }
 */
const getSortParams = (
  query,
  allowedFields = [],
  defaultField = 'createdAt',
  defaultOrder = 'desc'
) => {
  const sortField = allowedFields.includes(query.sort) ? query.sort : defaultField;
  const sortOrder = query.order === 'asc' ? 1 : -1;

  return { [sortField]: sortOrder };
};

module.exports = { getPaginationParams, getPaginationMeta, getSortParams };

