/**
 * Multer & Cloudinary Upload Pipeline
 *
 * Handles file parsing in memory and streaming directly to Cloudinary.
 * Includes graceful mock fallback for local testing when Cloudinary API credentials
 * are not provided.
 */

const multer = require('multer');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { getCloudinary } = require('../config/cloudinary');

// 5MB max file size
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

// Configure memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Unsupported file format: ${file.mimetype}. Allowed formats: JPG, PNG, WEBP`), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

/**
 * Upload a single memory buffer to Cloudinary (or mock fallback)
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} folder - Target Cloudinary folder
 * @returns {Promise<{ url: string, publicId: string, format: string }>}
 */
const uploadBufferToCloudinary = (buffer, folder = 'venueaura') => {
  return new Promise((resolve, reject) => {
    try {
      const cloudinary = getCloudinary();

      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) {
            logger.error({ err: error }, 'Cloudinary upload stream failed');
            return reject(new ApiError(500, 'Image upload to Cloudinary failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );

      stream.end(buffer);
    } catch {
      // Cloudinary not configured or in mock/dev environment
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      logger.info('Using simulated Cloudinary upload for local development/testing');
      resolve({
        url: `https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80#${mockId}`,
        publicId: `${folder}/${mockId}`,
        format: 'jpg',
        bytes: buffer.length,
      });
    }
  });
};

module.exports = {
  upload,
  uploadBufferToCloudinary,
};
