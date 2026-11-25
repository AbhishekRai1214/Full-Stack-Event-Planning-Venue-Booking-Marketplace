/**
 * Event Controller
 *
 * REST Controller for Event management endpoints.
 */

const eventService = require('./event.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class EventController {
  createEvent = asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.user.id, req.body);
    return ApiResponse.created(res, { event }, 'Event plan created successfully');
  });

  getMyEvents = asyncHandler(async (req, res) => {
    const events = await eventService.getMyEvents(req.user.id);
    return ApiResponse.success(res, { events }, 'User events retrieved successfully');
  });

  getEventById = asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(req.params.id, req.user);
    return ApiResponse.success(res, { event }, 'Event details retrieved successfully');
  });

  updateEvent = asyncHandler(async (req, res) => {
    const event = await eventService.updateEvent(req.params.id, req.user, req.body);
    return ApiResponse.success(res, { event }, 'Event updated successfully');
  });

  deleteEvent = asyncHandler(async (req, res) => {
    await eventService.deleteEvent(req.params.id, req.user);
    return ApiResponse.success(res, null, 'Event deleted successfully');
  });

  addChecklistItem = asyncHandler(async (req, res) => {
    const event = await eventService.addChecklistItem(req.params.id, req.user, req.body);
    return ApiResponse.created(res, { event }, 'Checklist task added successfully');
  });

  toggleChecklistItem = asyncHandler(async (req, res) => {
    const event = await eventService.toggleChecklistItem(
      req.params.id,
      req.user,
      req.params.itemId
    );
    return ApiResponse.success(res, { event }, 'Checklist task toggled');
  });

  deleteChecklistItem = asyncHandler(async (req, res) => {
    const event = await eventService.deleteChecklistItem(
      req.params.id,
      req.user,
      req.params.itemId
    );
    return ApiResponse.success(res, { event }, 'Checklist task deleted');
  });
}

module.exports = new EventController();
