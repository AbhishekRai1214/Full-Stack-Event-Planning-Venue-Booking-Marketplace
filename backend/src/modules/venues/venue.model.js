const mongoose = require('mongoose');
const { VENUE_STATUS, VENUE_TYPES, EVENT_TYPES } = require('../../constants');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: null,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
      maxlength: [120, 'Venue name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Venue description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for seeded venues
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      pincode: {
        type: String,
        default: '',
      },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },
    eventTypes: [
      {
        type: String,
        enum: EVENT_TYPES,
      },
    ],
    capacity: {
      min: {
        type: Number,
        required: [true, 'Minimum guest capacity is required'],
        min: 1,
      },
      max: {
        type: Number,
        required: [true, 'Maximum guest capacity is required'],
        index: true,
      },
    },
    pricing: {
      startingPrice: {
        type: Number,
        required: [true, 'Starting price is required'],
        index: true,
      },
      pricePerPlate: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: 'INR',
      },
    },
    venueType: {
      type: String,
      enum: VENUE_TYPES,
      default: 'banquet',
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [imageSchema],
    status: {
      type: String,
      enum: Object.values(VENUE_STATUS),
      default: VENUE_STATUS.APPROVED,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    ratings: {
      average: {
        type: Number,
        default: 4.8,
        min: 0,
        max: 5,
        set: v => Math.round(v * 10) / 10,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    availability: [
      {
        date: { type: Date, required: true },
        isBooked: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal search query performance
venueSchema.index({ status: 1, 'location.city': 1, 'pricing.startingPrice': 1 });
venueSchema.index({ status: 1, isFeatured: -1, 'ratings.average': -1 });
venueSchema.index({ name: 'text', description: 'text', 'location.city': 'text' });

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;

