/**
 * Chat Validation Schemas (Zod)
 */

const { z } = require('zod');

const startConversationSchema = z.object({
  recipientId: z.string().optional(),
  venueId: z.string().optional(),
  vendorId: z.string().optional(),
  bookingId: z.string().optional(),
  initialMessage: z.string().max(3000).optional(),
});

const sendMessageSchema = z.object({
  text: z.string().min(1, 'Message text cannot be empty').max(3000),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .optional(),
});

module.exports = {
  startConversationSchema,
  sendMessageSchema,
};
