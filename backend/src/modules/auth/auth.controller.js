/**
 * Auth Controller
 *
 * Handles HTTP requests for registration, login, logout, refresh, and profile retrieval.
 * Sets secure HttpOnly cookies for refresh token.
 */

const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

// Cookie options for HttpOnly refresh token
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return ApiResponse.created(
      res,
      { user, accessToken },
      'Registration successful. Welcome to VenueAura!'
    );
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return ApiResponse.success(res, { user, accessToken }, 'Login successful');
  });

  refreshToken = asyncHandler(async (req, res) => {
    // Read from cookie or body
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token);

    res.cookie('refreshToken', newRefreshToken, getCookieOptions());

    return ApiResponse.success(res, { user, accessToken }, 'Token refreshed successfully');
  });

  logout = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const userId = req.user?.id;

    if (userId) {
      await authService.logout(userId, token);
    }

    res.clearCookie('refreshToken', getCookieOptions());

    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);
    return ApiResponse.success(res, { user }, 'User profile retrieved successfully');
  });
}

module.exports = new AuthController();
