/**
 * Booking Routes
 *
 * Endpoints:
 *   POST   /api/v1/bookings/venues          - Create venue booking (CUSTOMER)
 *   POST   /api/v1/bookings/vendors         - Create vendor booking (CUSTOMER)
 *   GET    /api/v1/bookings/my              - Get my bookings (CUSTOMER)
 *   GET    /api/v1/bookings/:id             - Get booking by ID
 *   PATCH  /api/v1/bookings/:id/status      - Update status (VENDOR/ADMIN)
 *   POST   /api/v1/bookings/:id/cancel      - Cancel booking (CUSTOMER/ADMIN)
 *   GET    /api/v1/bookings                 - Admin: list all bookings
 */

const express = require('express');
const bookingController = require('./booking.controller');
const { authenticate } = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');
const { validate } = require('../../middleware/validate');
const {
  createVenueBookingSchema,
  createVendorBookingSchema,
  updateStatusSchema,
  cancelBookingSchema,
} = require('./booking.validation');
const { ROLES } = require('../../constants');

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// ─── Create bookings (CUSTOMER only) ─────────────────────────────────────────
router.post(
  '/venues',
  authorize(ROLES.CUSTOMER),
  validate(createVenueBookingSchema),
  bookingController.createVenueBooking
);

router.post(
  '/vendors',
  authorize(ROLES.CUSTOMER),
  validate(createVendorBookingSchema),
  bookingController.createVendorBooking
);

// ─── Customer dashboard ───────────────────────────────────────────────────────
router.get('/my', bookingController.getMyBookings);

// ─── Admin: list all bookings ─────────────────────────────────────────────────
router.get('/', authorize(ROLES.ADMIN), bookingController.getAllBookings);

// ─── Single booking operations ────────────────────────────────────────────────
router.get('/:id', bookingController.getBookingById);

router.patch(
  '/:id/status',
  authorize(ROLES.VENDOR, ROLES.ADMIN),
  validate(updateStatusSchema),
  bookingController.updateStatus
);

router.post(
  '/:id/cancel',
  validate(cancelBookingSchema),
  bookingController.cancelBooking
);

module.exports = router;
