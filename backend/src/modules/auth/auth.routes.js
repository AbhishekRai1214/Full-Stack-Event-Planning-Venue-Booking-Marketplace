/**
 * Auth Routes
 *
 * Defines authentication endpoints:
 * - POST /api/v1/auth/register
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/refresh
 * - POST /api/v1/auth/logout
 * - GET  /api/v1/auth/me
 */

const express = require('express');
const authController = require('./auth.controller');
const { validate } = require('../../middleware/validate');
const { registerSchema, loginSchema, refreshTokenSchema } = require('./auth.validation');
const { authenticate } = require('../../middleware/authenticate');
const { authRateLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/logout',
  authenticate,
  authController.logout
);

router.get(
  '/me',
  authenticate,
  authController.getMe
);

module.exports = router;
