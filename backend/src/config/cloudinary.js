/**
 * Cloudinary Configuration (Phase 13 – Image Upload Integration)
 *
 * This module will be fully implemented in Phase 13.
 * Currently provides the initialization stub and warning.
 */

let cloudinaryInstance = null;

const initCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    const logger = require('../utils/logger');
    logger.warn('⚠️  Cloudinary not configured. Image upload will not be available.');
    logger.warn('   Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
    return null;
  }

  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  cloudinaryInstance = cloudinary;
  return cloudinary;
};

const getCloudinary = () => {
  if (!cloudinaryInstance) {
    throw new Error('Cloudinary is not initialized. Call initCloudinary() first.');
  }
  return cloudinaryInstance;
};

module.exports = { initCloudinary, getCloudinary };

