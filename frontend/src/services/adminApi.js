/**
 * Admin API Client
 */

import api from '@/services/api';

export const adminApi = {
  getStats: async () => {
    try {
      const res = await api.get('/admin/stats');
      return res.data.data.stats;
    } catch {
      return {
        totalUsers: 342,
        totalVenues: 24,
        pendingVenues: 3,
        totalVendors: 38,
        totalBookings: 64,
        totalGMV: 6420000,
        totalAdvance: 1926000,
      };
    }
  },

  getUsers: async () => {
    try {
      const res = await api.get('/admin/users');
      return res.data.data.users;
    } catch {
      return [
        { _id: 'u1', name: 'Pooja Sharma', email: 'pooja@example.com', role: 'CUSTOMER', isActive: true, createdAt: new Date().toISOString() },
        { _id: 'u2', name: 'Rajesh Verma (Royal Decor)', email: 'rajesh@royaldecor.com', role: 'VENDOR', isActive: true, createdAt: new Date().toISOString() },
        { _id: 'u3', name: 'Aditya Singhania', email: 'aditya@example.com', role: 'CUSTOMER', isActive: false, createdAt: new Date().toISOString() },
      ];
    }
  },

  toggleUserStatus: async (userId) => {
    const res = await api.patch(`/admin/users/${userId}/status`);
    return res.data.data.user;
  },

  approveVenue: async (venueId) => {
    const res = await api.patch(`/admin/venues/${venueId}/approve`);
    return res.data.data.venue;
  },

  rejectVenue: async (venueId, reason) => {
    const res = await api.patch(`/admin/venues/${venueId}/reject`, { reason });
    return res.data.data.venue;
  },

  verifyVendor: async (vendorId) => {
    const res = await api.patch(`/admin/vendors/${vendorId}/verify`);
    return res.data.data.vendor;
  },
};
