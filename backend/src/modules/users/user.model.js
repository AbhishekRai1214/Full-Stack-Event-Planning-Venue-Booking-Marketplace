/**
 * User Mongoose Model
 *
 * Stores user profiles, authentication credentials, roles, and refresh tokens.
 *
 * SECURITY:
 * - Password stored with bcrypt hash (cost factor 12)
 * - Password has `select: false` so it is NEVER returned in normal queries
 * - Refresh tokens stored with expiresAt for rotation & revocation
 * - Email lowercase & trimmed with unique index
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: [ROLES.CUSTOMER, ROLES.VENDOR, ROLES.ADMIN],
        message: '{VALUE} is not a valid role',
      },
      default: ROLES.CUSTOMER,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\s\-()]{7,15}$/, 'Please provide a valid phone number'],
    },
    avatar: {
      url: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
      publicId: {
        type: String,
        default: null,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: true, // Set true by default in dev for seamless UX, can be configured via env
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    savedVenues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
      },
    ],
    savedVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ 'refreshTokens.token': 1 });

/**
 * Pre-save middleware: hash password before saving if modified
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare plain text candidate password with stored hash
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
