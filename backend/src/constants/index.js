/**
 * Application Constants
 *
 * WHY constants module:
 * - Avoid magic numbers/strings throughout the codebase
 * - Single source of truth for enum values
 * - Used by both Mongoose schemas and business logic
 * - Easy to update without searching the entire codebase
 */

// ─── User Roles ───────────────────────────────────────────────────────────────
const ROLES = Object.freeze({
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
});

// ─── Booking Status State Machine ──────────────────────────────────────────────
const BOOKING_STATUS = Object.freeze({
  ENQUIRY: 'enquiry',
  CONFIRMED: 'confirmed',
  ADVANCE_PAID: 'advance_paid',
  FULLY_PAID: 'fully_paid',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
});

/**
 * Valid status transitions – enforced in booking service
 * Key = current status, Value = array of allowed next statuses
 */
const BOOKING_STATUS_TRANSITIONS = Object.freeze({
  enquiry: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['advance_paid', 'cancelled'],
  advance_paid: ['fully_paid', 'cancelled'],
  fully_paid: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  rejected: [],
});

// ─── Venue ─────────────────────────────────────────────────────────────────────
const VENUE_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
});

const VENUE_TYPES = Object.freeze([
  'indoor',
  'outdoor',
  'rooftop',
  'banquet',
  'farmhouse',
  'hotel',
  'resort',
]);

// ─── Event Types ───────────────────────────────────────────────────────────────
const EVENT_TYPES = Object.freeze([
  'wedding',
  'birthday',
  'engagement',
  'baby_shower',
  'corporate',
  'farewell',
  'anniversary',
  'religious',
  'other',
]);

// ─── Vendor Categories ─────────────────────────────────────────────────────────
const VENDOR_CATEGORIES = Object.freeze([
  'photographer',
  'caterer',
  'decorator',
  'dj',
  'makeup',
  'transport',
  'florist',
  'band',
  'mehndi',
  'pandit',
  'invitation',
  'tent',
  'other',
]);

// ─── Budget Categories ─────────────────────────────────────────────────────────
const BUDGET_CATEGORIES = Object.freeze([
  'venue',
  'catering',
  'decoration',
  'photography',
  'dj',
  'transport',
  'makeup',
  'mehndi',
  'invitation',
  'clothing',
  'gifts',
  'other',
]);

// ─── Payment ───────────────────────────────────────────────────────────────────
const PAYMENT_STATUS = Object.freeze({
  CREATED: 'created',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

// ─── Notifications ─────────────────────────────────────────────────────────────
const NOTIFICATION_TYPES = Object.freeze({
  BOOKING_CREATED: 'booking_created',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_REJECTED: 'booking_rejected',
  PAYMENT_RECEIVED: 'payment_received',
  REVIEW_POSTED: 'review_posted',
  VENDOR_APPROVED: 'vendor_approved',
  VENUE_APPROVED: 'venue_approved',
  GENERAL: 'general',
});

// ─── HTTP Status Codes ─────────────────────────────────────────────────────────
const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});

// ─── Security ──────────────────────────────────────────────────────────────────
const BCRYPT_SALT_ROUNDS = 12; // Recommended: 10-14. Higher = slower = more secure

// ─── File Upload ───────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGES_PER_VENUE = 10;
const MAX_PORTFOLIO_IMAGES = 20;

// ─── Pagination Defaults ───────────────────────────────────────────────────────
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

// ─── Token Expiry ──────────────────────────────────────────────────────────────
const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_MINUTES = 10;
const REFRESH_TOKEN_MAX_PER_USER = 5; // Max concurrent sessions

module.exports = {
  ROLES,
  BOOKING_STATUS,
  BOOKING_STATUS_TRANSITIONS,
  VENUE_STATUS,
  VENUE_TYPES,
  EVENT_TYPES,
  VENDOR_CATEGORIES,
  BUDGET_CATEGORIES,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
  HTTP_STATUS,
  BCRYPT_SALT_ROUNDS,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGES_PER_VENUE,
  MAX_PORTFOLIO_IMAGES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  EMAIL_VERIFICATION_EXPIRY_HOURS,
  PASSWORD_RESET_EXPIRY_MINUTES,
  REFRESH_TOKEN_MAX_PER_USER,
};

