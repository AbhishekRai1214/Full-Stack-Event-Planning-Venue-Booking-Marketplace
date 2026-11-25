/**
 * Event Mongoose Model
 *
 * Stores customer events, timelines, associated venues and vendors, checklists,
 * guest counts, and status.
 */

const mongoose = require('mongoose');
const { EVENT_TYPES } = require('../../constants');

const eventSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event owner is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      minlength: [3, 'Event name must be at least 3 characters'],
      maxlength: [100, 'Event name cannot exceed 100 characters'],
    },
    eventType: {
      type: String,
      enum: {
        values: EVENT_TYPES,
        message: '{VALUE} is not a valid event type',
      },
      default: 'wedding',
      required: [true, 'Event type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: 'Mumbai',
    },
    guestCount: {
      type: Number,
      min: [1, 'Guest count must be at least 1'],
      default: 100,
    },
    estimatedBudget: {
      type: Number,
      default: 0,
      min: [0, 'Estimated budget cannot be negative'],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      default: null,
    },
    vendors: [
      {
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Vendor',
        },
        category: String,
        status: {
          type: String,
          enum: ['shortlisted', 'contacted', 'booked'],
          default: 'shortlisted',
        },
      },
    ],
    checklist: [
      {
        title: { type: String, required: true },
        category: { type: String, default: 'General' },
        isCompleted: { type: Boolean, default: false },
        dueDate: { type: Date, default: null },
      },
    ],
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['planning', 'confirmed', 'completed', 'cancelled'],
      default: 'planning',
      index: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
eventSchema.index({ owner: 1, date: -1 });
eventSchema.index({ eventType: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
