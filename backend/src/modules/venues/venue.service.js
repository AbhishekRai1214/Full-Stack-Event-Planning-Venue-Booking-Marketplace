const venueRepository = require('./venue.repository');
const ApiError = require('../../utils/ApiError');
const { getPaginationMeta } = require('../../utils/pagination');

class VenueService {
  buildFilter(query) {
    const filter = { status: 'approved' };

    if (query.city) {
      filter['location.city'] = { $regex: new RegExp(`^${query.city}$`, 'i') };
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { 'location.city': { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.eventType) {
      filter.eventTypes = query.eventType;
    }

    if (query.venueType) {
      filter.venueType = query.venueType;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter['pricing.startingPrice'] = {};
      if (query.minPrice !== undefined) filter['pricing.startingPrice'].$gte = query.minPrice;
      if (query.maxPrice !== undefined) filter['pricing.startingPrice'].$lte = query.maxPrice;
    }

    if (query.minCapacity !== undefined || query.maxCapacity !== undefined) {
      if (query.minCapacity !== undefined) {
        filter['capacity.max'] = { $gte: query.minCapacity };
      }
      if (query.maxCapacity !== undefined) {
        filter['capacity.min'] = { $lte: query.maxCapacity };
      }
    }

    if (query.rating !== undefined) {
      filter['ratings.average'] = { $gte: query.rating };
    }

    if (query.isFeatured !== undefined) {
      filter.isFeatured = query.isFeatured;
    }

    return filter;
  }

  buildSort(sortParam) {
    switch (sortParam) {
      case 'price_asc':
        return { 'pricing.startingPrice': 1 };
      case 'price_desc':
        return { 'pricing.startingPrice': -1 };
      case 'rating_desc':
        return { 'ratings.average': -1, 'ratings.count': -1 };
      case 'newest':
      default:
        return { isFeatured: -1, createdAt: -1 };
    }
  }

  generateSlug(name) {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000)
    );
  }

  async listVenues(query) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const filter = this.buildFilter(query);
    const sort = this.buildSort(query.sort);

    const { venues, total } = await venueRepository.findAll({ filter, skip, limit, sort });
    const meta = getPaginationMeta(total, page, limit);

    return { venues, meta };
  }

  async getVenueByIdOrSlug(idOrSlug) {
    const venue = await venueRepository.findBySlugOrId(idOrSlug);
    if (!venue) {
      throw ApiError.notFound('Venue');
    }
    return venue;
  }

  async createVenue(data, userId) {
    const slug = this.generateSlug(data.name);
    const venueData = {
      ...data,
      slug,
      owner: userId,
      status: 'approved',
    };
    return venueRepository.create(venueData);
  }

  async updateVenue(id, data, user) {
    const venue = await venueRepository.findById(id);
    if (!venue) {
      throw ApiError.notFound('Venue');
    }

    // Ownership check: only owner or ADMIN can modify
    if (user.role !== 'ADMIN' && venue.owner?.toString() !== user.id) {
      throw ApiError.forbidden('You do not have permission to modify this venue listing');
    }

    return venueRepository.update(id, data);
  }

  async deleteVenue(id, user) {
    const venue = await venueRepository.findById(id);
    if (!venue) {
      throw ApiError.notFound('Venue');
    }

    if (user.role !== 'ADMIN' && venue.owner?.toString() !== user.id) {
      throw ApiError.forbidden('You do not have permission to delete this venue listing');
    }

    return venueRepository.delete(id);
  }
}

module.exports = new VenueService();
