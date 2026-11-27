/**
 * Review Controller
 */

const reviewService = require('./review.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class ReviewController {
  createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(req.user.id, req.body);
    return ApiResponse.created(res, { review }, 'Review submitted successfully');
  });

  getVenueReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getVenueReviews(req.params.venueId);
    return ApiResponse.success(res, { reviews }, 'Venue reviews retrieved');
  });

  getVendorReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getVendorReviews(req.params.vendorId);
    return ApiResponse.success(res, { reviews }, 'Vendor reviews retrieved');
  });

  addOwnerResponse = asyncHandler(async (req, res) => {
    const review = await reviewService.addOwnerResponse(
      req.params.id,
      req.user,
      req.body.comment
    );
    return ApiResponse.success(res, { review }, 'Response posted successfully');
  });
}

module.exports = new ReviewController();
