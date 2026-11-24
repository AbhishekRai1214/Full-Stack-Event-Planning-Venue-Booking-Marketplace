const Vendor = require('./vendor.model');

class VendorRepository {
  async findAll({ filter = {}, skip = 0, limit = 12, sort = { createdAt: -1 } }) {
    const [vendors, total] = await Promise.all([
      Vendor.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Vendor.countDocuments(filter),
    ]);

    return { vendors, total };
  }

  async findById(id) {
    return Vendor.findById(id).lean();
  }

  async findBySlugOrId(idOrSlug) {
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      return Vendor.findById(idOrSlug).lean();
    }
    return Vendor.findOne({ slug: idOrSlug.toLowerCase() }).lean();
  }

  async findByUserId(userId) {
    return Vendor.findOne({ user: userId }).lean();
  }

  async create(data) {
    const vendor = new Vendor(data);
    return vendor.save();
  }

  async update(id, data) {
    return Vendor.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
  }

  async delete(id) {
    return Vendor.findByIdAndDelete(id).lean();
  }

  async count(filter = {}) {
    return Vendor.countDocuments(filter);
  }
}

module.exports = new VendorRepository();
