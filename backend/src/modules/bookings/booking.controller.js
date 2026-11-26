/**
 * Booking Controller
 *
 * Maps HTTP requests to booking service methods.
 */

const bookingService = require('./booking.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class BookingController {
  // POST /api/v1/bookings/venues
  createVenueBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.createVenueBooking(req.user.id, req.body);
    return ApiResponse.created(res, 'Venue booking enquiry submitted successfully', { booking });
  });

  // POST /api/v1/bookings/vendors
  createVendorBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.createVendorBooking(req.user.id, req.body);
    return ApiResponse.created(res, 'Vendor enquiry submitted successfully', { booking });
  });

  // GET /api/v1/bookings/my
  getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getMyBookings(req.user.id);
    return ApiResponse.success(res, 'Bookings retrieved successfully', { bookings });
  });

  // GET /api/v1/bookings/:id
  getBookingById = asyncHandler(async (req, res) => {
    const booking = await bookingService.getBookingById(req.params.id, req.user);
    return ApiResponse.success(res, 'Booking details retrieved successfully', { booking });
  });

  // PATCH /api/v1/bookings/:id/status
  updateStatus = asyncHandler(async (req, res) => {
    const booking = await bookingService.updateStatus(req.params.id, req.user, req.body);
    return ApiResponse.success(res, `Booking status updated to '${req.body.status}'`, { booking });
  });

  // POST /api/v1/bookings/:id/cancel
  cancelBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user,
      req.body.reason
    );
    return ApiResponse.success(res, 'Booking cancelled successfully', { booking });
  });

  // GET /api/v1/bookings (admin only)
  getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getAllBookings();
    return ApiResponse.success(res, 'All bookings retrieved', { bookings });
  });
}

module.exports = new BookingController();
