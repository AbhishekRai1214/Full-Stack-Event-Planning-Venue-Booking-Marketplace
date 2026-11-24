const { z } = require('zod');
const { VENDOR_CATEGORIES } = require('../../constants');

const listVendorsQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 12)),
  city: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  maxPrice: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  minExperience: z.string().optional().transform(val => (val ? parseInt(val, 10) : undefined)),
  rating: z.string().optional().transform(val => (val ? parseFloat(val) : undefined)),
  sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'experience_desc', 'newest']).optional(),
  isFeatured: z.string().optional().transform(val => val === 'true'),
});

const createVendorSchema = z.object({
  businessName: z.string().min(3, 'Business name must be at least 3 characters').max(120),
  category: z.enum(VENDOR_CATEGORIES),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  avatar: z.string().url('Invalid avatar URL').optional(),
  coverImage: z.string().url('Invalid cover image URL').optional(),
  location: z.object({
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    serviceAreas: z.array(z.string()).optional(),
  }),
  experience: z.number().min(0, 'Experience must be 0 or more years'),
  startingPrice: z.number().min(0, 'Starting price must be positive'),
  packages: z
    .array(
      z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        price: z.number().min(0),
        currency: z.string().default('INR'),
        includes: z.array(z.string()).optional(),
      })
    )
    .optional(),
  portfolio: z
    .array(
      z.object({
        url: z.string().url(),
        caption: z.string().optional(),
      })
    )
    .optional(),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional().or(z.literal('')),
      instagram: z.string().optional(),
    })
    .optional(),
});

const updateVendorSchema = createVendorSchema.partial();

module.exports = {
  listVendorsQuerySchema,
  createVendorSchema,
  updateVendorSchema,
};
