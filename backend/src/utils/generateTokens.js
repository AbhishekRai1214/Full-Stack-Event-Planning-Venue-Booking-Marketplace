/**
 * Token Generation & Verification Utilities
 *
 * This module centralizes all token operations:
 * - JWT access tokens (short-lived, stateless)
 * - Opaque refresh tokens (long-lived, stored in DB for revocability)
 * - Secure random tokens (email verification, password reset)
 *
 * SECURITY PRINCIPLES:
 * - Access tokens: signed with secret, 15-minute expiry, in-memory on client
 * - Refresh tokens: opaque (not JWT), stored HttpOnly cookie, DB-validated
 * - Verification tokens: hashed before DB storage (like passwords)
 *   → If DB is compromised, raw tokens are not exposed
 *
 * INTERVIEW QUESTION: Why use opaque refresh tokens instead of JWT refresh tokens?
 * → Opaque tokens stored in DB can be revoked instantly (logout, password change).
 *   JWT refresh tokens cannot be revoked without additional infrastructure.
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate a JWT access token
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string} Signed JWT
 */
const generateAccessToken = payload => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';

  return jwt.sign(payload, secret, {
    expiresIn: expiry,
    issuer: 'venueaura',
    audience: 'venueaura-client',
  });
};

/**
 * Verify and decode a JWT access token
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyAccessToken = token => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  return jwt.verify(token, secret, {
    issuer: 'venueaura',
    audience: 'venueaura-client',
  });
};

/**
 * Generate a secure opaque refresh token (64 random bytes = 128 hex chars)
 * NOT a JWT – stored in DB and verified by lookup
 * @returns {string} Hex string refresh token
 */
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Generate a secure token pair for email verification or password reset.
 * Returns both the raw token (sent to user) and the hashed version (stored in DB).
 *
 * WHY hash? If the DB is compromised, attackers cannot use the hashed token.
 * Same principle as hashing passwords.
 *
 * @returns {{ rawToken: string, hashedToken: string }}
 */
const generateSecureToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
};

/**
 * Hash a token for secure comparison or storage
 * @param {string} token
 * @returns {string} SHA-256 hash
 */
const hashToken = token => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  generateSecureToken,
  hashToken,
};

