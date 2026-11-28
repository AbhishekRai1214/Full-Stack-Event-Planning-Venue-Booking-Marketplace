import api from '../../services/api';

/**
 * Chat API Client
 */
export const chatApi = {
  /**
   * Get all conversations for current user
   */
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data?.data || response.data;
  },

  /**
   * Start or fetch existing conversation
   */
  startConversation: async ({ recipientId, venueId, vendorId, bookingId, initialMessage }) => {
    const response = await api.post('/chat/conversations', {
      recipientId,
      venueId,
      vendorId,
      bookingId,
      initialMessage,
    });
    return response.data?.data || response.data;
  },

  /**
   * Get message history for a conversation
   */
  getMessages: async (conversationId, page = 1, limit = 50) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return response.data?.data || response.data;
  },

  /**
   * Send a message
   */
  sendMessage: async (conversationId, { text, attachments = [] }) => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, {
      text,
      attachments,
    });
    return response.data?.data || response.data;
  },

  /**
   * Mark messages in conversation as read
   */
  markAsRead: async (conversationId) => {
    const response = await api.put(`/chat/conversations/${conversationId}/read`);
    return response.data?.data || response.data;
  },
};
