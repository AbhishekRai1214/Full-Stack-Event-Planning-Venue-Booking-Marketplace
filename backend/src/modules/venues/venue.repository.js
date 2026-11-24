const Venue = require('./venue.model');

class VenueRepository {
  async findAll({ filter = {}, skip = 0, limit = 12, sort = { createdAt: -1 } }) {
    const [venues, total] = await Promise.all([
      Venue.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Venue.countDocuments(filter),
    ]);

    return { venues, total };
  }

  async findById(id) {
    return Venue.findById(id).lean();
  }

  async findBySlugOrId(idOrSlug) {
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      return Venue.findById(idOrSlug).lean();
    }
    return Venue.findOne({ slug: idOrSlug.toLowerCase() }).lean();
  }

  async create(data) {
    const venue = new Venue(data);
    return venue.save();
  }

  async update(id, data) {
    return Venue.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
  }

  async delete(id) {
    return Venue.findByIdAndDelete(id).lean();
  }

  async count(filter = {}) {
    return Venue.countDocuments(filter);
  }
}

module.exports = new VenueRepository();

