/**
 * Event Service
 *
 * Business logic for Event management.
 * Enforces resource ownership (only owner or ADMIN can view/edit/delete).
 */

const eventRepository = require('./event.repository');
const ApiError = require('../../utils/ApiError');
const { ROLES } = require('../../constants');

class EventService {
  async createEvent(userId, eventData) {
    const payload = {
      ...eventData,
      owner: userId,
    };

    // Auto-populate default wedding/celebration checklist items if empty
    if (!payload.checklist || payload.checklist.length === 0) {
      payload.checklist = [
        { title: 'Finalize Guest List & Invitations', category: 'Guests', isCompleted: false },
        { title: 'Confirm Venue Booking & Advance Deposit', category: 'Venue', isCompleted: !!payload.venue },
        { title: 'Book Photographer & Videographer', category: 'Photography', isCompleted: false },
        { title: 'Schedule Menu Tasting with Caterer', category: 'Catering', isCompleted: false },
        { title: 'Decide Theme & Floral Stage Decor', category: 'Decoration', isCompleted: false },
        { title: 'Select Music & DJ Playlist', category: 'Entertainment', isCompleted: false },
      ];
    }

    return eventRepository.create(payload);
  }

  async getMyEvents(userId) {
    return eventRepository.findByOwner(userId);
  }

  async getEventById(eventId, user) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // Ownership check
    if (event.owner.toString() !== user.id && user.role !== ROLES.ADMIN) {
      throw new ApiError(403, 'You do not have permission to view this event');
    }

    return event;
  }

  async updateEvent(eventId, user, updateData) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.owner.toString() !== user.id && user.role !== ROLES.ADMIN) {
      throw new ApiError(403, 'You do not have permission to modify this event');
    }

    return eventRepository.updateById(eventId, updateData);
  }

  async deleteEvent(eventId, user) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.owner.toString() !== user.id && user.role !== ROLES.ADMIN) {
      throw new ApiError(403, 'You do not have permission to delete this event');
    }

    return eventRepository.deleteById(eventId);
  }

  async addChecklistItem(eventId, user, item) {
    const event = await this.getEventById(eventId, user);
    return eventRepository.addChecklistItem(event._id, item);
  }

  async toggleChecklistItem(eventId, user, itemId) {
    await this.getEventById(eventId, user);
    return eventRepository.toggleChecklistItem(eventId, itemId);
  }

  async deleteChecklistItem(eventId, user, itemId) {
    await this.getEventById(eventId, user);
    return eventRepository.deleteChecklistItem(eventId, itemId);
  }
}

module.exports = new EventService();
