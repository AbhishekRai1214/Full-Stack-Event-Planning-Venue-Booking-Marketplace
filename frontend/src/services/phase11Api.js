/**
 * Reviews, Notifications, and Contact API Clients
 */

import api from '@/services/api';

export const reviewsApi = {
  getVenueReviews: async (venueId) => {
    try {
      const res = await api.get(`/reviews/venues/${venueId}`);
      return res.data.data.reviews;
    } catch {
      return [];
    }
  },

  getVendorReviews: async (vendorId) => {
    try {
      const res = await api.get(`/reviews/vendors/${vendorId}`);
      return res.data.data.reviews;
    } catch {
      return [];
    }
  },

  createReview: async (reviewData) => {
    const res = await api.post('/reviews', reviewData);
    return res.data.data.review;
  },

  respondToReview: async (reviewId, comment) => {
    const res = await api.post(`/reviews/${reviewId}/respond`, { comment });
    return res.data.data.review;
  },
};

export const notificationsApi = {
  getMyNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      return res.data.data;
    } catch {
      return { notifications: [], unreadCount: 0 };
    }
  },

  markAsRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data.data.notification;
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
    return true;
  },
};

export const contactApi = {
  submitInquiry: async (inquiryData) => {
    const res = await api.post('/contact', inquiryData);
    return res.data;
  },
};
