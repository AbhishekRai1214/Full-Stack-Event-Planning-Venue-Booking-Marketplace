const mongoose = require('mongoose');
const { VENDOR_CATEGORIES } = require('../../constants');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    includes: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for seeded vendors
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [120, 'Business name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: VENDOR_CATEGORIES,
      required: [true, 'Vendor category is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    location: {
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
      serviceAreas: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    experience: {
      type: Number,
      default: 5, // in years
      min: 0,
    },
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: 0,
      index: true,
    },
    packages: [packageSchema],
    portfolio: [portfolioSchema],
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
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
  },
  {
    timestamps: true,
  }
);

// Compound indexes
vendorSchema.index({ status: 1, category: 1, 'location.city': 1 });
vendorSchema.index({ status: 1, isFeatured: -1, 'ratings.average': -1 });
vendorSchema.index({ businessName: 'text', description: 'text', 'location.city': 'text' });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
