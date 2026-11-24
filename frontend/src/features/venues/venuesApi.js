import api from '@/services/api';
import { sampleVenues } from './venuesData';

export const venuesApi = {
  /**
   * Fetch paginated & filtered venues
   */
  getVenues: async (params = {}) => {
    try {
      const response = await api.get('/venues', { params });
      return response.data;
    } catch (err) {
      console.warn('API unavailable, falling back to local venues dataset:', err.message);
      // Fallback filtering on client for robust offline / local testing
      let list = [...sampleVenues];

      if (params.city) {
        list = list.filter(v => v.location.city.toLowerCase() === params.city.toLowerCase());
      }
      if (params.eventType) {
        list = list.filter(v => v.eventTypes.includes(params.eventType));
      }
      if (params.venueType) {
        list = list.filter(v => v.venueType === params.venueType);
      }
      if (params.minPrice) {
        list = list.filter(v => v.pricing.startingPrice >= Number(params.minPrice));
      }
      if (params.maxPrice) {
        list = list.filter(v => v.pricing.startingPrice <= Number(params.maxPrice));
      }
      if (params.minCapacity) {
        list = list.filter(v => v.capacity.max >= Number(params.minCapacity));
      }
      if (params.rating) {
        list = list.filter(v => v.ratings.average >= Number(params.rating));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          v =>
            v.name.toLowerCase().includes(q) ||
            v.location.city.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q)
        );
      }

      // Sorting
      if (params.sort === 'price_asc') {
        list.sort((a, b) => a.pricing.startingPrice - b.pricing.startingPrice);
      } else if (params.sort === 'price_desc') {
        list.sort((a, b) => b.pricing.startingPrice - a.pricing.startingPrice);
      } else if (params.sort === 'rating_desc') {
        list.sort((a, b) => b.ratings.average - a.ratings.average);
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
   * Fetch single venue by ID or slug
   */
  getVenueByIdOrSlug: async (idOrSlug) => {
    try {
      const response = await api.get(`/venues/${idOrSlug}`);
      return response.data;
    } catch (err) {
      console.warn('API unavailable, searching local dataset for:', idOrSlug);
      const venue = sampleVenues.find(
        v => v.id === idOrSlug || v.slug === idOrSlug
      );
      if (venue) {
        return { success: true, data: venue };
      }
      throw new Error('Venue not found');
    }
  },
};

export default venuesApi;
