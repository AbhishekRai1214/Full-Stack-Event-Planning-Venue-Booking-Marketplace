import api from '@/services/api';
import { sampleVendors } from './vendorsData';

export const vendorsApi = {
  /**
   * Fetch paginated & filtered vendors
   */
  getVendors: async (params = {}) => {
    try {
      const response = await api.get('/vendors', { params });
      return response.data;
    } catch (err) {
      console.warn('API unavailable, falling back to local vendors dataset:', err.message);
      let list = [...sampleVendors];

      if (params.category) {
        list = list.filter(v => v.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.city) {
        list = list.filter(v => v.location.city.toLowerCase() === params.city.toLowerCase());
      }
      if (params.minPrice) {
        list = list.filter(v => v.startingPrice >= Number(params.minPrice));
      }
      if (params.maxPrice) {
        list = list.filter(v => v.startingPrice <= Number(params.maxPrice));
      }
      if (params.minExperience) {
        list = list.filter(v => v.experience >= Number(params.minExperience));
      }
      if (params.rating) {
        list = list.filter(v => v.ratings.average >= Number(params.rating));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          v =>
            v.businessName.toLowerCase().includes(q) ||
            v.location.city.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q)
        );
      }

      // Sort
      if (params.sort === 'price_asc') {
        list.sort((a, b) => a.startingPrice - b.startingPrice);
      } else if (params.sort === 'price_desc') {
        list.sort((a, b) => b.startingPrice - a.startingPrice);
      } else if (params.sort === 'rating_desc') {
        list.sort((a, b) => b.ratings.average - a.ratings.average);
      } else if (params.sort === 'experience_desc') {
        list.sort((a, b) => b.experience - a.experience);
      }

      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 9;
      const total = list.length;
      const totalPages = Math.ceil(total / limit);
      const paginated = list.slice((page - 1) * limit, page * limit);

      return {
        success: true,
        data: paginated,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }
  },

  /**
   * Fetch single vendor by ID or slug
   */
  getVendorByIdOrSlug: async (idOrSlug) => {
    try {
      const response = await api.get(`/vendors/${idOrSlug}`);
      return response.data;
    } catch (err) {
      console.warn('API unavailable, searching local dataset for vendor:', idOrSlug);
      const vendor = sampleVendors.find(
        v => v.id === idOrSlug || v.slug === idOrSlug
      );
      if (vendor) {
        return { success: true, data: vendor };
      }
      throw new Error('Vendor not found');
    }
  },
};

export default vendorsApi;
