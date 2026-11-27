import api from '../../services/api';

/**
 * Payments API Service
 */
export const paymentsApi = {
  /**
   * Fetch Razorpay public key ID
   */
  getKey: async () => {
    const response = await api.get('/payments/key');
    return response.data?.data || response.data;
  },

  /**
   * Create Razorpay payment order
   */
  createOrder: async ({ bookingId, paymentType = 'advance' }) => {
    const response = await api.post('/payments/create-order', { bookingId, paymentType });
    return response.data?.data || response.data;
  },

  /**
   * Verify Razorpay payment signature
   */
  verifyPayment: async ({ bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await api.post('/payments/verify', {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return response.data?.data || response.data;
  },

  /**
   * Get payments associated with a booking
   */
  getBookingPayments: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data?.data || response.data;
  },

  /**
   * Upload image to Cloudinary pipeline
   */
  uploadImage: async (file, folder = 'venueaura/uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/upload/single?folder=${encodeURIComponent(folder)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data || response.data;
  },
};
