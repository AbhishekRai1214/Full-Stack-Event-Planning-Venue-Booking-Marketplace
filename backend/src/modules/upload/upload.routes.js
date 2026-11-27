/**
 * Upload Routes
 *
 * Exposes endpoints for uploading images to Cloudinary (single or multiple).
 */

const express = require('express');
const { upload, uploadBufferToCloudinary } = require('../../middleware/upload');
const { authenticate } = require('../../middleware/authenticate');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

/**
 * POST /api/v1/upload/single
 * Upload single image
 */
router.post(
  '/single',
  authenticate,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'No image file uploaded');
    }

    const folder = req.query.folder || 'venueaura/uploads';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    return ApiResponse.success(res, 201, 'Image uploaded successfully', result);
  })
);

/**
 * POST /api/v1/upload/multiple
 * Upload up to 5 images
 */
router.post(
  '/multiple',
  authenticate,
  upload.array('files', 5),
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, 'No image files uploaded');
    }

    const folder = req.query.folder || 'venueaura/uploads';
    const uploadPromises = req.files.map((file) => uploadBufferToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    return ApiResponse.success(res, 201, `${results.length} images uploaded successfully`, results);
  })
);

module.exports = router;
