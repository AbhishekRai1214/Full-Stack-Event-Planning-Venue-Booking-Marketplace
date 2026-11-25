/**
 * Event Routes
 *
 * Routes:
 * - POST   /api/v1/events            - Create a new event
 * - GET    /api/v1/events            - Get all events belonging to logged-in user
 * - GET    /api/v1/events/:id        - Get event details by ID
 * - PATCH  /api/v1/events/:id        - Update event
 * - DELETE /api/v1/events/:id        - Delete event
 * - POST   /api/v1/events/:id/tasks  - Add checklist task
 * - PATCH  /api/v1/events/:id/tasks/:itemId/toggle - Toggle checklist task completion
 * - DELETE /api/v1/events/:id/tasks/:itemId        - Remove checklist task
 */

const express = require('express');
const eventController = require('./event.controller');
const { authenticate } = require('../../middleware/authenticate');
const { validate } = require('../../middleware/validate');
const {
  createEventSchema,
  updateEventSchema,
  addChecklistItemSchema,
} = require('./event.validation');

const router = express.Router();

// All event operations require authentication
router.use(authenticate);

router
  .route('/')
  .post(validate(createEventSchema), eventController.createEvent)
  .get(eventController.getMyEvents);

router
  .route('/:id')
  .get(eventController.getEventById)
  .patch(validate(updateEventSchema), eventController.updateEvent)
  .delete(eventController.deleteEvent);

router.post(
  '/:id/tasks',
  validate(addChecklistItemSchema),
  eventController.addChecklistItem
);

router.patch(
  '/:id/tasks/:itemId/toggle',
  eventController.toggleChecklistItem
);

router.delete(
  '/:id/tasks/:itemId',
  eventController.deleteChecklistItem
);

module.exports = router;
