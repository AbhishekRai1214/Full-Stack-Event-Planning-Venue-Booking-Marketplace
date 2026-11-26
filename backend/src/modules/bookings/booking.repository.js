/**
 * Booking Repository
 *
 * All database interactions for the Booking collection.
 */

const Booking = require('./booking.model');

class BookingRepository {
  async create(bookingData) {
    return Booking.create(bookingData);
  }

  async findById(id) {
    return Booking.findById(id)
      .populate('customer', 'name email phone avatar')
      .populate('venue', 'name slug city images pricing capacity location owner')
      .populate('vendor', 'name slug category city image pricing owner');
  }

  async findByCustomer(customerId, filters = {}) {
    const query = { customer: customerId, ...filters };
    return Booking.find(query)
      .populate('venue', 'name city images')
      .populate('vendor', 'name category city image')
      .sort({ createdAt: -1 });
  }

  /**
   * Find all bookings for venues/vendors owned by this vendor user.
   * Used by the vendor dashboard.
   */
  async findByVenueOwner(venueIds, filters = {}) {
    const query = {
      bookingType: 'venue',
      venue: { $in: venueIds },
      ...filters,
    };
    return Booking.find(query)
      .populate('customer', 'name email phone avatar')
      .populate('venue', 'name city')
      .sort({ createdAt: -1 });
  }

  async findByVendorOwner(vendorIds, filters = {}) {
    const query = {
      bookingType: 'vendor',
      vendor: { $in: vendorIds },
      ...filters,
    };
    return Booking.find(query)
      .populate('customer', 'name email phone avatar')
      .populate('vendor', 'name category city')
      .sort({ createdAt: -1 });
  }

  /**
   * Check venue availability on a specific date.
   * Returns any conflicting active booking.
   */
  async findConflictingVenueBooking(venueId, date) {
    const eventDate = new Date(date);
    const startOfDay = new Date(eventDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(eventDate);
    endOfDay.setHours(23, 59, 59, 999);

    return Booking.findOne({
      venue: venueId,
      'event.date': { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'rejected'] },
    });
  }

  async updateById(id, updateData) {
    return Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('customer', 'name email phone avatar')
      .populate('venue', 'name slug city images pricing capacity')
      .populate('vendor', 'name slug category city image pricing');
  }

  async countByStatus(query = {}) {
    return Booking.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }

  async findAll(filters = {}) {
    return Booking.find(filters)
      .populate('customer', 'name email')
      .populate('venue', 'name city')
      .populate('vendor', 'name category')
      .sort({ createdAt: -1 });
  }
}

module.exports = new BookingRepository();
