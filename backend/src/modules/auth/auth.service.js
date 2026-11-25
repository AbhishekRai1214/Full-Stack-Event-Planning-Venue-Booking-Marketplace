/**
 * Auth Service
 *
 * Implements authentication business logic:
 * - Registration with password hashing
 * - Login with credential verification & refresh token issuance
 * - Token refresh with rotation & revocation of stale tokens
 * - Logout with refresh token clearing
 */

const userRepository = require('../users/user.repository');
const { generateAccessToken, generateRefreshToken } = require('../../utils/generateTokens');
const ApiError = require('../../utils/ApiError');

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists.');
    }

    // Create user (pre-save hook hashes password)
    const user = await userRepository.create(userData);

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await userRepository.addRefreshToken(user._id, refreshToken, expiresAt);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate user & issue tokens
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Clean up expired tokens
    await userRepository.removeExpiredRefreshTokens(user._id);

    // Generate new tokens
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await userRepository.addRefreshToken(user._id, refreshToken, expiresAt);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate refresh token and issue new access token
   */
  async refreshToken(token) {
    if (!token) {
      throw new ApiError(401, 'Refresh token is required');
    }

    const user = await userRepository.findByRefreshToken(token);
    if (!user) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated');
    }

    // Rotate: invalidate old refresh token
    await userRepository.removeRefreshToken(user._id, token);

    // Issue new pair
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await userRepository.addRefreshToken(user._id, newRefreshToken, expiresAt);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout – remove refresh token
   */
  async logout(userId, token) {
    if (token) {
      await userRepository.removeRefreshToken(userId, token);
    } else {
      await userRepository.clearAllRefreshTokens(userId);
    }
  }

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
