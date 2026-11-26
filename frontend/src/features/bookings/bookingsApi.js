/**
 * Bookings API Service
 *
 * Communicates with backend booking endpoints.
 * Includes rich mock fallback data for offline/presentation mode.
 */

import api from '@/services/api';

// ─── Rich Mock Seed Data ──────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    _id: 'bk_1',
    id: 'bk_1',
    bookingNumber: 'VA-20261124-RJVL4',
    bookingType: 'venue',
    status: 'confirmed',
    event: {
      name: 'Ananya & Kabir Grand Royal Wedding',
      type: 'wedding',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      guestCount: 650,
    },
    venue: {
      _id: '1',
      name: 'The Oberoi Rajvilas Palace',
      city: 'Jaipur, Rajasthan',
      images: [{ url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' }],
    },
    pricing: {
      baseAmount: 1200000,
      taxes: 216000,
      totalAmount: 1416000,
      advanceRequired: 424800,
      advancePaid: 424800,
      currency: 'INR',
    },
    notes: 'Garden ceremony preferred, with mandap setup near the reflecting pool.',
    vendorNotes: 'Venue confirmed for the requested date. Bridal suite will be prepared.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'bk_2',
    id: 'bk_2',
    bookingNumber: 'VA-20261125-MBK23',
    bookingType: 'vendor',
    status: 'enquiry',
    event: {
      name: 'Wedding Photography & Film',
      type: 'wedding',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      guestCount: 650,
    },
    vendor: {
      _id: 'v1',
      name: 'Studio Lumière Photography',
      category: 'photographer',
      city: 'Mumbai & Goa',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80',
    },
    pricing: {
      baseAmount: 180000,
      totalAmount: 180000,
      advanceRequired: 54000,
      advancePaid: 0,
      currency: 'INR',
    },
    notes: 'Requesting full-day candid coverage + drone aerial shots of palace.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'bk_3',
    id: 'bk_3',
    bookingNumber: 'VA-20261101-KDS72',
    bookingType: 'venue',
    status: 'completed',
    event: {
      name: 'Aarav 1st Birthday Carnival',
      type: 'birthday',
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      guestCount: 120,
    },
    venue: {
      _id: '2',
      name: 'Skyline Terrace Banquet & Lawn',
      city: 'Bandra, Mumbai',
      images: [{ url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80' }],
    },
    pricing: {
      baseAmount: 180000,
      taxes: 32400,
      totalAmount: 212400,
      advanceRequired: 63720,
      advancePaid: 212400,
      currency: 'INR',
    },
    notes: '',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const bookingsApi = {
  getMyBookings: async () => {
    try {
      const res = await api.get('/bookings/my');
      return res.data.data.bookings;
    } catch (err) {
      console.warn('Backend unavailable, using mock bookings');
      const stored = localStorage.getItem('venueaura_mock_bookings');
      return stored ? JSON.parse(stored) : MOCK_BOOKINGS;
    }
  },

  getBookingById: async (id) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return res.data.data.booking;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_bookings');
      const list = stored ? JSON.parse(stored) : MOCK_BOOKINGS;
      const found = list.find((b) => (b._id || b.id) === id);
      if (found) return found;
      throw err;
    }
  },

  createVenueBooking: async (data) => {
    try {
      const res = await api.post('/bookings/venues', data);
      return res.data.data.booking;
    } catch (err) {
      console.warn('Backend unavailable, saving mock venue booking');
      const stored = localStorage.getItem('venueaura_mock_bookings');
      const list = stored ? JSON.parse(stored) : [...MOCK_BOOKINGS];
      const newBooking = {
        _id: 'bk_' + Date.now(),
        id: 'bk_' + Date.now(),
        bookingNumber: `VA-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,7).toUpperCase()}`,
        bookingType: 'venue',
        status: 'enquiry',
        event: { ...data.event, date: data.event?.date },
        venue: { _id: data.venueId, name: 'Selected Venue', city: 'India' },
        pricing: { baseAmount: 0, totalAmount: 0, advanceRequired: 0, advancePaid: 0, currency: 'INR' },
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      };
      list.unshift(newBooking);
      localStorage.setItem('venueaura_mock_bookings', JSON.stringify(list));
      return newBooking;
    }
  },

  createVendorBooking: async (data) => {
    try {
      const res = await api.post('/bookings/vendors', data);
      return res.data.data.booking;
    } catch (err) {
      console.warn('Backend unavailable, saving mock vendor booking');
      const stored = localStorage.getItem('venueaura_mock_bookings');
      const list = stored ? JSON.parse(stored) : [...MOCK_BOOKINGS];
      const newBooking = {
        _id: 'bk_' + Date.now(),
        id: 'bk_' + Date.now(),
        bookingNumber: `VA-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,7).toUpperCase()}`,
        bookingType: 'vendor',
        status: 'enquiry',
        event: { ...data.event, date: data.event?.date },
        vendor: { _id: data.vendorId, name: 'Selected Vendor', category: 'photographer' },
        pricing: { baseAmount: data.pricing?.baseAmount || 0, totalAmount: data.pricing?.baseAmount || 0, advanceRequired: 0, advancePaid: 0, currency: 'INR' },
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      };
      list.unshift(newBooking);
      localStorage.setItem('venueaura_mock_bookings', JSON.stringify(list));
      return newBooking;
    }
  },

  cancelBooking: async (id, reason) => {
    try {
      const res = await api.post(`/bookings/${id}/cancel`, { reason });
      return res.data.data.booking;
    } catch (err) {
      const stored = localStorage.getItem('venueaura_mock_bookings');
      const list = stored ? JSON.parse(stored) : [...MOCK_BOOKINGS];
      const index = list.findIndex((b) => (b._id || b.id) === id);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          status: 'cancelled',
          cancellation: { reason, cancelledAt: new Date().toISOString(), refundStatus: 'none' },
        };
        localStorage.setItem('venueaura_mock_bookings', JSON.stringify(list));
        return list[index];
      }
      throw err;
    }
  },
};

export default bookingsApi;
