const express = require('express');
const venueController = require('./venue.controller');
const { validate } = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');
const {
  listVenuesQuerySchema,
  createVenueSchema,
  updateVenueSchema,
} = require('./venue.validation');

const router = express.Router();

// Public discovery endpoints
router.get('/', validate(listVenuesQuerySchema, 'query'), venueController.listVenues);
router.get('/:idOrSlug', venueController.getVenue);

// Protected vendor/admin endpoints
router.post(
  '/',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(createVenueSchema, 'body'),
  venueController.createVenue
);

router.patch(
  '/:id',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(updateVenueSchema, 'body'),
  venueController.updateVenue
);

router.delete(
  '/:id',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  venueController.deleteVenue
);

module.exports = router;
