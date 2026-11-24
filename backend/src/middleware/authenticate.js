/**
 * Authentication Middleware
 *
 * Verifies the JWT access token on every protected route.
 * Attaches the decoded user payload to req.user.
 *
 * Token source: Authorization header → "Bearer <token>"
 *
 * WHY Bearer token (not cookie) for access tokens:
 * - Access tokens are short-lived (15m) so XSS risk window is small
 * - Refresh tokens (long-lived, 7d) are stored HttpOnly cookie (XSS-safe)
 * - Bearer pattern works well for SPAs and future mobile apps
 *
 * This middleware does NOT check the database.
 * JWT verification is stateless and fast.
 * Database lookup for user status happens in specific routes that need it.
 *
 * INTERVIEW QUESTION: What does req.user contain after authenticate runs?
 * → { id, email, role } – just the JWT payload. NOT the full user document.
 *   If you need the full user, fetch it in the service layer.
 */

const { verifyAccessToken } = require('../utils/generateTokens');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(
      401,
      'Authentication required. Please provide a Bearer token in the Authorization header.'
    );
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  if (!token || token === 'undefined' || token === 'null') {
    throw new ApiError(401, 'Authentication token is missing or invalid');
  }

  // Verify the token (throws JsonWebTokenError or TokenExpiredError on failure)
  const decoded = verifyAccessToken(token);

  // Attach minimal user context to request
  // NEVER attach the full DB user here – this is stateless
  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };

  next();
});

module.exports = { authenticate };

