import axios from 'axios';

/**
 * Axios API Client
 *
 * WHY a configured axios instance instead of fetch:
 * - Base URL configured once, not in every call
 * - Interceptors for token attachment and refresh
 * - Consistent error handling
 * - Automatic JSON parsing
 * - withCredentials for HttpOnly cookie (refresh token)
 *
 * TOKEN STRATEGY:
 * - Access token: stored in memory (this module) → XSS-safe (not in localStorage)
 * - Refresh token: HttpOnly cookie → sent automatically with each /auth/refresh call
 *
 * AUTO-REFRESH FLOW:
 * 1. API call returns 401 (token expired)
 * 2. Interceptor calls POST /auth/refresh
 * 3. If refresh succeeds → new access token stored, original request retried
 * 4. If refresh fails → user redirected to login
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies (refresh token HttpOnly cookie)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// ─── In-Memory Access Token Storage ──────────────────────────────────────────
// WHY memory not localStorage: localStorage is accessible by any JavaScript
// on the page (XSS risk). Memory is cleared on page refresh, which is
// acceptable since the refresh token cookie will get a new access token.

let _accessToken = null;

export const setAccessToken = token => {
  _accessToken = token;
};

export const getAccessToken = () => _accessToken;

export const clearAccessToken = () => {
  _accessToken = null;
};

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach the access token to every outgoing request
api.interceptors.request.use(
  config => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// Handle 401 errors by attempting to refresh the access token
let isRefreshing = false;
let failedQueue = []; // Queue of requests that failed while refreshing

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 and not already retried and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt token refresh (refresh token is sent via cookie automatically)
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data.data;

        setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();

        // Only redirect if we're not already on an auth page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

