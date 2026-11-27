/**
 * Payment Routes – Phase 13
 *
 * Endpoints for Razorpay order creation, payment signature verification,
 * and payment lookup.
 */

const express = require('express');
const paymentController = require('./payment.controller');
const { authenticate } = require('../../middleware/authenticate');
const { validate } = require('../../middleware/validate');
const { createOrderSchema, verifyPaymentSchema } = require('./payment.validation');

const router = express.Router();

// Get Razorpay client key
router.get('/key', authenticate, paymentController.getKey);

// Create order for a booking
router.post(
  '/create-order',
  authenticate,
  validate(createOrderSchema, 'body'),
  paymentController.createOrder
);

// Verify signature & transition booking state
router.post(
  '/verify',
  authenticate,
  validate(verifyPaymentSchema, 'body'),
  paymentController.verifyPayment
);

// Get payment records by booking ID
router.get(
  '/booking/:bookingId',
  authenticate,
  paymentController.getPaymentByBooking
);

module.exports = router;
