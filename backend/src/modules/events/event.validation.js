/**
 * Event Validation Schemas
 *
 * Zod validation for creating and updating events.
 */

const { z } = require('zod');
const { EVENT_TYPES } = require('../../constants');

const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters').max(100),
  eventType: z.enum(EVENT_TYPES, {
    errorMap: () => ({ message: 'Please select a valid event category' }),
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid event date is required',
  }),
  endDate: z.string().optional().nullable(),
  city: z.string().min(2).max(100).default('Mumbai'),
  guestCount: z.coerce.number().min(1).default(100),
  estimatedBudget: z.coerce.number().min(0).default(0),
  venue: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().default(''),
  checklist: z
    .array(
      z.object({
        title: z.string().min(1),
        category: z.string().optional(),
        isCompleted: z.boolean().optional(),
        dueDate: z.string().optional().nullable(),
      })
    )
    .optional(),
});

const updateEventSchema = createEventSchema.partial().extend({
  status: z.enum(['planning', 'confirmed', 'completed', 'cancelled']).optional(),
});

const addChecklistItemSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  category: z.string().optional().default('General'),
  dueDate: z.string().optional().nullable(),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  addChecklistItemSchema,
};
