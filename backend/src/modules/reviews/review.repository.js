/**
 * Review Repository
 */

const Review = require('./review.model');

class ReviewRepository {
  async create(reviewData) {
    return Review.create(reviewData);
  }

  async findById(id) {
    return Review.findById(id)
      .populate('author', 'name avatar role')
      .populate('venue', 'name slug city images')
      .populate('vendor', 'name slug category city image');
  }

  async findByVenue(venueId) {
    return Review.find({ venue: venueId, isHidden: false })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
  }

  async findByVendor(vendorId) {
    return Review.find({ vendor: vendorId, isHidden: false })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
  }

  async addOwnerResponse(reviewId, comment) {
    return Review.findByIdAndUpdate(
      reviewId,
      {
        ownerResponse: {
          comment,
          respondedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  async calculateAverageRating(targetType, targetId) {
    const matchField = targetType === 'venue' ? 'venue' : 'vendor';
    const stats = await Review.aggregate([
      { $match: { [matchField]: targetId, isHidden: false } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return stats.length > 0
      ? { avgRating: Number(stats[0].avgRating.toFixed(1)), totalReviews: stats[0].totalReviews }
      : { avgRating: 5.0, totalReviews: 0 };
  }
}

module.exports = new ReviewRepository();
