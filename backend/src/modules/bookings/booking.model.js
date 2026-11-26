/**
 * Booking Mongoose Model
 *
 * Implements the full booking state machine for venue and vendor bookings.
 *
 * STATE MACHINE: enquiry → confirmed → advance_paid → fully_paid → completed
 *                                     (or cancelled / rejected from most states)
 *
 * WHY a booking number (VA-YYYYMMDD-XXXXX)?
 * - Human-readable reference for support tickets and invoices
 * - Customer can quote it in phone/email conversations
 * - More professional than a MongoDB ObjectId
 *
 * WHY store bookingType ('venue' | 'vendor')?
 * - Single unified bookings collection for both types
 * - Simplifies reporting and admin dashboards
 * - Venue bookings have strict date exclusivity; vendor bookings are enquiry-based
 */

const mongoose = require('mongoose');
const { BOOKING_STATUS, EVENT_TYPES } = require('../../constants');

// ─── Booking Number Generator ─────────────────────────────────────────────────
const generateBookingNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const random = Math.random().toString(36).substring(2, 7).toUpperCase(); // 5 chars
  return `VA-${dateStr}-${random}`;
};

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      default: generateBookingNumber,
    },

    // ── Parties ───────────────────────────────────────────────────────────────
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer reference is required'],
      index: true,
    },

    // ── Target: Venue OR Vendor ───────────────────────────────────────────────
    bookingType: {
      type: String,
      enum: ['venue', 'vendor'],
      required: [true, 'Booking type (venue or vendor) is required'],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      default: null,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },

    // ── Event Details ─────────────────────────────────────────────────────────
    event: {
      name: { type: String, trim: true },
      type: {
        type: String,
        enum: EVENT_TYPES,
        default: 'wedding',
      },
      date: { type: Date, required: [true, 'Event date is required'] },
      guestCount: { type: Number, min: 1, default: 50 },
    },

    // ── Pricing ───────────────────────────────────────────────────────────────
    pricing: {
      baseAmount: { type: Number, default: 0, min: 0 },
      taxes: { type: Number, default: 0, min: 0 },
      totalAmount: { type: Number, default: 0, min: 0 },
      currency: { type: String, default: 'INR' },
      advanceRequired: { type: Number, default: 0, min: 0 }, // 30% typically
      advancePaid: { type: Number, default: 0, min: 0 },
    },

    // ── Booking Status State Machine ──────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.ENQUIRY,
      index: true,
    },

    // ── Notes ─────────────────────────────────────────────────────────────────
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    vendorNotes: {
      type: String,
      maxlength: [1000, 'Vendor notes cannot exceed 1000 characters'],
      default: '',
    },

    // ── Cancellation ──────────────────────────────────────────────────────────
    cancellation: {
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reason: { type: String, default: '' },
      cancelledAt: { type: Date, default: null },
      refundAmount: { type: Number, default: 0 },
      refundStatus: {
        type: String,
        enum: ['none', 'pending', 'processed', 'failed'],
        default: 'none',
      },
    },

    // ── Payment Reference ─────────────────────────────────────────────────────
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Compound Indexes ─────────────────────────────────────────────────────────
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ venue: 1, 'event.date': 1 }); // Availability checks
bookingSchema.index({ vendor: 1, 'event.date': 1 });
// bookingNumber unique index already applied by the field-level definition above

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
