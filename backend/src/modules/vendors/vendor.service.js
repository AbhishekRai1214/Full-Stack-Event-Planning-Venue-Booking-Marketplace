const vendorRepository = require('./vendor.repository');
const ApiError = require('../../utils/ApiError');
const { getPaginationMeta } = require('../../utils/pagination');

class VendorService {
  buildFilter(query) {
    const filter = { status: 'approved' };

    if (query.city) {
      filter['location.city'] = { $regex: new RegExp(`^${query.city}$`, 'i') };
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.search) {
      filter.$or = [
        { businessName: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { 'location.city': { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.startingPrice = {};
      if (query.minPrice !== undefined) filter.startingPrice.$gte = query.minPrice;
      if (query.maxPrice !== undefined) filter.startingPrice.$lte = query.maxPrice;
    }

    if (query.minExperience !== undefined) {
      filter.experience = { $gte: query.minExperience };
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
        return { startingPrice: 1 };
      case 'price_desc':
        return { startingPrice: -1 };
      case 'rating_desc':
        return { 'ratings.average': -1, 'ratings.count': -1 };
      case 'experience_desc':
        return { experience: -1 };
      case 'newest':
      default:
        return { isFeatured: -1, createdAt: -1 };
    }
  }

  generateSlug(businessName) {
    return (
      businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000)
    );
  }

  async listVendors(query) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const filter = this.buildFilter(query);
    const sort = this.buildSort(query.sort);

    const { vendors, total } = await vendorRepository.findAll({ filter, skip, limit, sort });
    const meta = getPaginationMeta(total, page, limit);

    return { vendors, meta };
  }

  async getVendorByIdOrSlug(idOrSlug) {
    const vendor = await vendorRepository.findBySlugOrId(idOrSlug);
    if (!vendor) {
      throw ApiError.notFound('Vendor');
    }
    return vendor;
  }

  async createVendorProfile(data, userId) {
    const existing = await vendorRepository.findByUserId(userId);
    if (existing) {
      throw ApiError.conflict('A vendor profile already exists for this user account');
    }

    const slug = this.generateSlug(data.businessName);
    const vendorData = {
      ...data,
      slug,
      user: userId,
      status: 'approved',
    };

    return vendorRepository.create(vendorData);
  }

  async updateVendorProfile(id, data, user) {
    const vendor = await vendorRepository.findById(id);
    if (!vendor) {
      throw ApiError.notFound('Vendor');
    }

    if (user.role !== 'ADMIN' && vendor.user?.toString() !== user.id) {
      throw ApiError.forbidden('You do not have permission to modify this vendor profile');
    }

    return vendorRepository.update(id, data);
  }

  async deleteVendorProfile(id, user) {
    const vendor = await vendorRepository.findById(id);
    if (!vendor) {
      throw ApiError.notFound('Vendor');
    }

    if (user.role !== 'ADMIN' && vendor.user?.toString() !== user.id) {
      throw ApiError.forbidden('You do not have permission to delete this vendor profile');
    }

    return vendorRepository.delete(id);
  }
}

module.exports = new VendorService();
