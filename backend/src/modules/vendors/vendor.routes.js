const express = require('express');
const vendorController = require('./vendor.controller');
const { validate } = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');
const {
  listVendorsQuerySchema,
  createVendorSchema,
  updateVendorSchema,
} = require('./vendor.validation');

const router = express.Router();

// Public discovery endpoints
router.get('/', validate(listVendorsQuerySchema, 'query'), vendorController.listVendors);
router.get('/:idOrSlug', vendorController.getVendor);

// Protected vendor/admin endpoints
router.post(
  '/profile',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(createVendorSchema, 'body'),
  vendorController.createVendorProfile
);

router.patch(
  '/:id',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(updateVendorSchema, 'body'),
  vendorController.updateVendorProfile
);

router.delete(
  '/:id',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  vendorController.deleteVendorProfile
);

module.exports = router;
