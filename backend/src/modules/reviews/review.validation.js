/**
 * Review Validation Schemas (Zod)
 */

const { z } = require('zod');

const createReviewSchema = z.object({
  targetType: z.enum(['venue', 'vendor']),
  venueId: z.string().optional(),
  vendorId: z.string().optional(),
  bookingId: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().max(120).optional().default(''),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional().nullable(),
      })
    )
    .optional(),
});

const ownerResponseSchema = z.object({
  comment: z.string().min(5, 'Response comment must be at least 5 characters').max(1000),
});

module.exports = {
  createReviewSchema,
  ownerResponseSchema,
};
