/**
 * Review Service
 */

const reviewRepository = require('./review.repository');
const ApiError = require('../../utils/ApiError');
const { ROLES } = require('../../constants');

class ReviewService {
  async createReview(userId, data) {
    const payload = {
      ...data,
      author: userId,
      venue: data.venueId || null,
      vendor: data.vendorId || null,
      booking: data.bookingId || null,
    };

    return reviewRepository.create(payload);
  }

  async getVenueReviews(venueId) {
    return reviewRepository.findByVenue(venueId);
  }

  async getVendorReviews(vendorId) {
    return reviewRepository.findByVendor(vendorId);
  }

  async addOwnerResponse(reviewId, user, comment) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    // Role check: Vendor or Admin
    if (user.role !== ROLES.VENDOR && user.role !== ROLES.ADMIN) {
      throw new ApiError(403, 'Only verified hosts or administrators can reply to reviews');
    }

    return reviewRepository.addOwnerResponse(reviewId, comment);
  }
}

module.exports = new ReviewService();
