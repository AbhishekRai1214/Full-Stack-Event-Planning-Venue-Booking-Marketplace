/**
 * Payment Mongoose Model
 *
 * Tracks Razorpay transactions, order IDs, HMAC-SHA256 signatures,
 * amounts in paise, currencies, and webhook audit logs.
 */

const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../../constants');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required'],
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer reference is required'],
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay Order ID is required'],
      unique: true,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: null,
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: null,
    },
    amount: {
      type: Number,
      required: [true, 'Amount (in paise) is required'],
      min: [100, 'Minimum payment amount is ₹1.00 (100 paise)'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      index: true,
    },
    idempotencyKey: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    method: {
      type: String,
      default: 'upi',
    },
    webhookEvents: [
      {
        event: { type: String, required: true },
        payload: { type: mongoose.Schema.Types.Mixed },
        processedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.index({ customer: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
