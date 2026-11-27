/**
 * Review Mongoose Model
 *
 * Stores customer reviews and ratings for venues and vendors.
 *
 * RULES:
 * - One review per booking (`booking` unique index).
 * - Verified booker badge (`isVerified: true` if booking is completed).
 * - Owner response subdocument for vendor/venue management replies.
 * - Auto-recalculates average rating on venue/vendor on save.
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    targetType: {
      type: String,
      enum: ['venue', 'vendor'],
      required: [true, 'Target type (venue or vendor) is required'],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      default: null,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
      sparse: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      minlength: [10, 'Review comment must be at least 10 characters'],
      maxlength: [2000, 'Review comment cannot exceed 2000 characters'],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: null },
      },
    ],
    isVerified: {
      type: Boolean,
      default: true,
    },
    ownerResponse: {
      comment: { type: String, default: null },
      respondedAt: { type: Date, default: null },
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
reviewSchema.index({ venue: 1, createdAt: -1 });
reviewSchema.index({ vendor: 1, createdAt: -1 });
reviewSchema.index({ author: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
