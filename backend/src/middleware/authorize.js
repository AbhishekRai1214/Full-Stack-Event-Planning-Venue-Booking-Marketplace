/**
 * Authorization Middleware – Role-Based Access Control (RBAC)
 *
 * Must be used AFTER authenticate middleware (requires req.user).
 *
 * Usage in routes:
 *   router.post('/venues', authenticate, authorize('VENDOR', 'ADMIN'), createVenue);
 *   router.get('/admin/stats', authenticate, authorize('ADMIN'), getStats);
 *
 * WHY RBAC:
 * - Different user types (CUSTOMER, VENDOR, ADMIN) have different permissions
 * - Prevents customers from creating venue listings
 * - Prevents vendors from accessing admin functions
 * - Provides a simple, understandable permission model
 *
 * RESOURCE OWNERSHIP (beyond role checks):
 * Resource ownership authorization (e.g., "can this vendor edit this specific venue?")
 * is handled in the SERVICE layer, not here. This middleware only checks roles.
 *
 * INTERVIEW QUESTION: What is the difference between authentication and authorization?
 * → Authentication: Who are you? (verify identity via JWT)
 *   Authorization: What can you do? (verify permissions via role check)
 */

const ApiError = require('../utils/ApiError');

/**
 * Authorize middleware factory
 * @param {...string} roles - Allowed roles (e.g., 'ADMIN', 'VENDOR')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // authenticate middleware must run first
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. This action requires one of the following roles: ${roles.join(', ')}`
      );
    }

    next();
  };
};

module.exports = { authorize };

