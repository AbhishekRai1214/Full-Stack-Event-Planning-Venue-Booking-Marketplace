/**
 * Auth API Service
 *
 * Connects frontend client to backend auth endpoints.
 * Includes local mock / fallback resilience for seamless demo experience.
 */

import api, { setAccessToken, clearAccessToken } from '@/services/api';

export const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, phone, role }
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, accessToken } = response.data.data;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      return { user, accessToken };
    } catch (error) {
      // If network fails (e.g. backend offline during pure UI testing), provide fallback demo user
      if (!error.response) {
        console.warn('Backend unavailable, using simulated registration session');
        const simulatedUser = {
          id: 'user_' + Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'CUSTOMER',
          phone: userData.phone || '+91 98765 43210',
          avatar: {
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          },
          isEmailVerified: true,
        };
        const simulatedToken = 'mock_jwt_access_token_' + Date.now();
        setAccessToken(simulatedToken);
        return { user: simulatedUser, accessToken: simulatedToken };
      }
      throw error;
    }
  },

  /**
   * Log in user with credentials
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      return { user, accessToken };
    } catch (error) {
      // Provide demo user fallback if backend is offline
      if (!error.response) {
        console.warn('Backend unavailable, using simulated login session');
        let role = 'CUSTOMER';
        let name = 'Priya Sharma';
        if (email.includes('vendor')) {
          role = 'VENDOR';
          name = 'Rajesh Verma (Royal Decorators)';
        } else if (email.includes('admin')) {
          role = 'ADMIN';
          name = 'Super Admin';
        }

        const simulatedUser = {
          id: 'mock_' + (role.toLowerCase()),
          name,
          email,
          role,
          phone: '+91 98765 43210',
          avatar: {
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          },
          isEmailVerified: true,
        };
        const simulatedToken = 'mock_jwt_access_token_' + Date.now();
        setAccessToken(simulatedToken);
        return { user: simulatedUser, accessToken: simulatedToken };
      }
      throw error;
    }
  },

  /**
   * Refresh current access token
   */
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { user, accessToken } = response.data.data;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      return { user, accessToken };
    } catch (error) {
      clearAccessToken();
      throw error;
    }
  },

  /**
   * Log out user
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API call failed or offline:', err.message);
    } finally {
      clearAccessToken();
    }
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },
};

export default authApi;
