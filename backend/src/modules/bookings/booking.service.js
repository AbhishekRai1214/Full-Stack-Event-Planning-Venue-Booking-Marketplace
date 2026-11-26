/**
 * Booking Service
 *
 * Core business logic for the booking state machine.
 *
 * KEY RULES ENFORCED HERE:
 * 1. Venue availability check before creating venue bookings
 * 2. Status transition validation (state machine)
 * 3. Role-based status update permissions
 *    - CUSTOMER can: cancel
 *    - VENDOR can: confirm, reject, mark completed
 *    - ADMIN can: any transition
 * 4. Resource ownership checks
 *
 * INTERVIEW TIP: Why put business rules in the Service layer, not Controller?
 * → Controllers handle HTTP request/response mechanics.
 *   Services contain the pure business logic.
 *   This separation makes the business logic unit-testable without HTTP infrastructure.
 */

const bookingRepository = require('./booking.repository');
const ApiError = require('../../utils/ApiError');
const { BOOKING_STATUS, BOOKING_STATUS_TRANSITIONS, ROLES } = require('../../constants');

class BookingService {
  // ─── Create Venue Booking ─────────────────────────────────────────────────
  async createVenueBooking(customerId, { venueId, event, pricing, notes }) {
    // Check availability: no active booking on same date
    const conflict = await bookingRepository.findConflictingVenueBooking(
      venueId,
      event.date
    );

    if (conflict) {
      throw new ApiError(
        409,
        `This venue is already booked on ${new Date(event.date).toLocaleDateString('en-IN')}. Please choose a different date.`
      );
    }

    // Calculate a default advance required (30% of base amount)
    const baseAmount = pricing?.baseAmount || 0;
    const taxes = pricing?.taxes || Math.round(baseAmount * 0.18); // 18% GST
    const totalAmount = pricing?.totalAmount || baseAmount + taxes;
    const advanceRequired = pricing?.advanceRequired || Math.round(totalAmount * 0.3);

    const booking = await bookingRepository.create({
      customer: customerId,
      bookingType: 'venue',
      venue: venueId,
      event: {
        ...event,
        date: new Date(event.date),
      },
      pricing: {
        baseAmount,
        taxes,
        totalAmount,
        advanceRequired,
        currency: 'INR',
      },
      notes: notes || '',
      status: BOOKING_STATUS.ENQUIRY,
    });

    return booking;
  }

  // ─── Create Vendor Booking ────────────────────────────────────────────────
  async createVendorBooking(customerId, { vendorId, event, pricing, notes }) {
    // Vendor bookings are enquiry-based (no strict date exclusivity check)
    const baseAmount = pricing?.baseAmount || 0;
    const totalAmount = pricing?.totalAmount || baseAmount;

    const booking = await bookingRepository.create({
      customer: customerId,
      bookingType: 'vendor',
      vendor: vendorId,
      event: {
        ...event,
        date: new Date(event.date),
      },
      pricing: {
        baseAmount,
        totalAmount,
        taxes: 0,
        advanceRequired: Math.round(totalAmount * 0.3),
        currency: 'INR',
      },
      notes: notes || '',
      status: BOOKING_STATUS.ENQUIRY,
    });

    return booking;
  }

  // ─── Get Booking by ID (with ownership) ──────────────────────────────────
  async getBookingById(bookingId, user) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');

    if (user.role === ROLES.ADMIN) return booking;

    // Customer can see their own bookings
    if (
      user.role === ROLES.CUSTOMER &&
      booking.customer._id.toString() !== user.id
    ) {
      throw new ApiError(403, 'You do not have permission to view this booking');
    }

    return booking;
  }

  // ─── Get Customer's Bookings ──────────────────────────────────────────────
  async getMyBookings(userId) {
    return bookingRepository.findByCustomer(userId);
  }

  // ─── Update Booking Status (State Machine) ────────────────────────────────
  async updateStatus(bookingId, user, { status: newStatus, vendorNotes }) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');

    const currentStatus = booking.status;

    // 1. Validate the transition is allowed in state machine
    const allowedTransitions = BOOKING_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new ApiError(
        400,
        `Cannot transition booking from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`
      );
    }

    // 2. Validate role-based permissions for the transition
    this._checkTransitionPermission(user, booking, newStatus);

    // 3. Build update payload
    const updatePayload = { status: newStatus };
    if (vendorNotes) updatePayload.vendorNotes = vendorNotes;

    return bookingRepository.updateById(bookingId, updatePayload);
  }

  // ─── Cancel Booking ───────────────────────────────────────────────────────
  async cancelBooking(bookingId, user, reason) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, 'Booking not found');

    // Ownership: Customer can only cancel their own booking
    if (
      user.role === ROLES.CUSTOMER &&
      booking.customer._id.toString() !== user.id
    ) {
      throw new ApiError(403, 'You can only cancel your own bookings');
    }

    // Check if cancellation is a valid transition
    const allowedTransitions = BOOKING_STATUS_TRANSITIONS[booking.status] || [];
    if (!allowedTransitions.includes(BOOKING_STATUS.CANCELLED)) {
      throw new ApiError(
        400,
        `Bookings with status '${booking.status}' cannot be cancelled`
      );
    }

    return bookingRepository.updateById(bookingId, {
      status: BOOKING_STATUS.CANCELLED,
      cancellation: {
        cancelledBy: user.id,
        reason,
        cancelledAt: new Date(),
        refundAmount: 0, // Calculated by payment logic in Phase 13
        refundStatus: booking.pricing.advancePaid > 0 ? 'pending' : 'none',
      },
    });
  }

  // ─── Admin: Get All Bookings ──────────────────────────────────────────────
  async getAllBookings(filters = {}) {
    return bookingRepository.findAll(filters);
  }

  // ─── Private: Transition Permission Guard ─────────────────────────────────
  _checkTransitionPermission(user, booking, newStatus) {
    if (user.role === ROLES.ADMIN) return; // Admin can do any valid transition

    const isCustomerBooking = booking.customer._id.toString() === user.id;
    const customerAllowed = [BOOKING_STATUS.CANCELLED];

    const vendorAllowed = [
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.REJECTED,
      BOOKING_STATUS.COMPLETED,
    ];

    if (user.role === ROLES.CUSTOMER) {
      if (!isCustomerBooking) {
        throw new ApiError(403, 'You can only update your own bookings');
      }
      if (!customerAllowed.includes(newStatus)) {
        throw new ApiError(
          403,
          `Customers are not permitted to set a booking to '${newStatus}'`
        );
      }
    } else if (user.role === ROLES.VENDOR) {
      if (!vendorAllowed.includes(newStatus)) {
        throw new ApiError(
          403,
          `Vendors are not permitted to set a booking to '${newStatus}'`
        );
      }
    }
  }
}

module.exports = new BookingService();
