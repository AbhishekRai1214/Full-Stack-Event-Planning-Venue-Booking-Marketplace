const { z } = require('zod');
const { VENUE_TYPES, EVENT_TYPES } = require('../../constants');

const listVenuesQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 12)),
  city: z.string().optional(),
  search: z.string().optional(),
  eventType: z.string().optional(),
  venueType: z.string().optional(),
  minPrice: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  maxPrice: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  minCapacity: z.string().optional().transform(val => (val ? parseInt(val, 10) : undefined)),
  maxCapacity: z.string().optional().transform(val => (val ? parseInt(val, 10) : undefined)),
  rating: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'newest']).optional(),
  isFeatured: z.string().optional().transform(val => val === 'true'),
});

const createVenueSchema = z.object({
  name: z.string().min(3, 'Venue name must be at least 3 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().optional(),
    coordinates: z
      .object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      })
      .optional(),
  }),
  eventTypes: z.array(z.enum(EVENT_TYPES)).min(1, 'Select at least one event type'),
  capacity: z.object({
    min: z.number().min(1, 'Minimum capacity must be at least 1'),
    max: z.number().min(1, 'Maximum capacity must be greater than 0'),
  }),
  pricing: z.object({
    startingPrice: z.number().min(0, 'Starting price must be positive'),
    pricePerPlate: z.number().min(0).optional(),
    currency: z.string().default('INR'),
  }),
  venueType: z.enum(VENUE_TYPES).default('banquet'),
  facilities: z.array(z.string()).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
        publicId: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .min(1, 'At least one image is required'),
});

const updateVenueSchema = createVenueSchema.partial();

module.exports = {
  listVenuesQuerySchema,
  createVenueSchema,
  updateVenueSchema,
};
