/**
 * Event Repository
 *
 * Database access layer for Event collection.
 */

const Event = require('./event.model');

class EventRepository {
  async create(eventData) {
    return Event.create(eventData);
  }

  async findById(id) {
    return Event.findById(id)
      .populate('venue', 'name slug city location images startingPrice capacity rating')
      .populate('vendors.vendor', 'name slug category city image startingPrice rating');
  }

  async findByOwner(ownerId) {
    return Event.find({ owner: ownerId })
      .populate('venue', 'name city images startingPrice')
      .sort({ date: 1 });
  }

  async updateById(id, updateData) {
    return Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('venue', 'name slug city location images startingPrice capacity rating')
      .populate('vendors.vendor', 'name slug category city image startingPrice rating');
  }

  async deleteById(id) {
    return Event.findByIdAndDelete(id);
  }

  async addChecklistItem(eventId, item) {
    return Event.findByIdAndUpdate(
      eventId,
      { $push: { checklist: item } },
      { new: true }
    );
  }

  async toggleChecklistItem(eventId, itemId) {
    const event = await Event.findById(eventId);
    if (!event) return null;

    const item = event.checklist.id(itemId);
    if (item) {
      item.isCompleted = !item.isCompleted;
      await event.save();
    }
    return event;
  }

  async deleteChecklistItem(eventId, itemId) {
    return Event.findByIdAndUpdate(
      eventId,
      { $pull: { checklist: { _id: itemId } } },
      { new: true }
    );
  }
}

module.exports = new EventRepository();
