/**
 * Rate Limiting Middleware
 *
 * WHY rate limiting:
 * - Prevent brute-force attacks (especially on auth routes)
 * - Protect against DoS/DDoS attacks
 * - Prevent API abuse
 * - Control server resource usage
 *
 * We use different limits for different route types:
 * - Global: generous limit for normal browsing
 * - Auth: strict limit to prevent password brute-forcing
 * - Contact form: very strict to prevent spam
 *
 * INTERVIEW QUESTION: What is rate limiting and why is it important for auth?
 * → Without rate limiting, an attacker can try millions of password combinations
 *   per second. With a limit of 5 attempts per 15 minutes, brute-forcing
 *   a 6-character password would take years instead of seconds.
 */

const rateLimit = require('express-rate-limit');

/**
 * Factory function to create rate limiters with consistent config
 */
const createRateLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return rate limit info in RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    message: {
      success: false,
      message,
    },
    // Skip rate limiting for successful requests (count only failures)
    // skipSuccessfulRequests: true, // Uncomment for auth routes in production
  });

/**
 * Global rate limit: 200 requests per 15 minutes per IP
 * Applied to ALL routes
 */
const globalRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  200,
  'Too many requests from this IP. Please try again after 15 minutes.'
);

/**
 * Auth rate limit: 5 attempts per 15 minutes per IP
 * Applied to: POST /auth/login, POST /auth/register, POST /auth/forgot-password
 *
 * WHY stricter: Prevents brute-force password attacks
 */
const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many authentication attempts. Please try again after 15 minutes.'
);

/**
 * Contact form rate limit: 3 submissions per hour per IP
 * Applied to: POST /contact
 *
 * WHY: Prevent contact form spam
 */
const contactRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3,
  'Too many contact form submissions. Please try again after 1 hour.'
);

/**
 * API rate limit: 100 requests per 15 minutes (for sensitive API operations)
 */
const apiRateLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  'Too many API requests. Please slow down.'
);

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  contactRateLimiter,
  apiRateLimiter,
};

