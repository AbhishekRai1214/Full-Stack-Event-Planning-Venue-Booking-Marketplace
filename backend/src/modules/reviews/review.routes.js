/**
 * Review Routes
 *
 * Endpoints:
 * - POST  /api/v1/reviews
 * - GET   /api/v1/reviews/venues/:venueId
 * - GET   /api/v1/reviews/vendors/:vendorId
 * - POST  /api/v1/reviews/:id/respond
 */

const express = require('express');
const reviewController = require('./review.controller');
const { authenticate } = require('../../middleware/authenticate');
const { validate } = require('../../middleware/validate');
const {
  createReviewSchema,
  ownerResponseSchema,
} = require('./review.validation');

const router = express.Router();

router.get('/venues/:venueId', reviewController.getVenueReviews);
router.get('/vendors/:vendorId', reviewController.getVendorReviews);

router.post(
  '/',
  authenticate,
  validate(createReviewSchema),
  reviewController.createReview
);

router.post(
  '/:id/respond',
  authenticate,
  validate(ownerResponseSchema),
  reviewController.addOwnerResponse
);

module.exports = router;
