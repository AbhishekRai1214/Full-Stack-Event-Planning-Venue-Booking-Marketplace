/**
 * Payment Controller
 *
 * Handles HTTP requests for Razorpay order generation, signature verification,
 * and payment history inquiries.
 */

const paymentService = require('./payment.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * Get Razorpay public key ID for client checkout
 */
const getKey = asyncHandler(async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key';
  return ApiResponse.success(res, 200, 'Razorpay key fetched', { keyId });
});

/**
 * Create a new Razorpay payment order
 */
const createOrder = asyncHandler(async (req, res) => {
  const result = await paymentService.createOrder(req.user.id, req.validatedBody);
  return ApiResponse.success(res, 201, 'Payment order created successfully', result);
});

/**
 * Verify Razorpay payment signature
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyPayment(req.user.id, req.validatedBody);
  return ApiResponse.success(res, 200, 'Payment verified and captured successfully', result);
});

/**
 * Get all payment records for a booking
 */
const getPaymentByBooking = asyncHandler(async (req, res) => {
  const payments = await paymentService.getPaymentByBooking(req.params.bookingId);
  return ApiResponse.success(res, 200, 'Booking payments retrieved', payments);
});

module.exports = {
  getKey,
  createOrder,
  verifyPayment,
  getPaymentByBooking,
};
