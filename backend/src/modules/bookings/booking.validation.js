/**
 * Booking Validation Schemas (Zod)
 */

const { z } = require('zod');
const { EVENT_TYPES, BOOKING_STATUS } = require('../../constants');

const createVenueBookingSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  event: z.object({
    name: z.string().min(2).max(100).optional(),
    type: z.enum(EVENT_TYPES).default('wedding'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Valid event date is required',
    }),
    guestCount: z.coerce.number().min(1).default(100),
  }),
  pricing: z
    .object({
      baseAmount: z.coerce.number().min(0).optional(),
      taxes: z.coerce.number().min(0).optional(),
      totalAmount: z.coerce.number().min(0).optional(),
      advanceRequired: z.coerce.number().min(0).optional(),
    })
    .optional(),
  notes: z.string().max(1000).optional().default(''),
});

const createVendorBookingSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  event: z.object({
    name: z.string().min(2).max(100).optional(),
    type: z.enum(EVENT_TYPES).default('wedding'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Valid event date is required',
    }),
    guestCount: z.coerce.number().min(1).default(100),
  }),
  pricing: z
    .object({
      baseAmount: z.coerce.number().min(0).optional(),
      totalAmount: z.coerce.number().min(0).optional(),
    })
    .optional(),
  notes: z.string().max(1000).optional().default(''),
});

const updateStatusSchema = z.object({
  status: z.enum(Object.values(BOOKING_STATUS)),
  vendorNotes: z.string().max(1000).optional(),
});

const cancelBookingSchema = z.object({
  reason: z.string().min(5, 'Cancellation reason must be at least 5 characters').max(500),
});

module.exports = {
  createVenueBookingSchema,
  createVendorBookingSchema,
  updateStatusSchema,
  cancelBookingSchema,
};
