/**
 * User Repository
 *
 * Handles database operations for User model.
 */

const User = require('./user.model');

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  async findByRefreshToken(token) {
    return User.findOne({
      'refreshTokens.token': token,
      'refreshTokens.expiresAt': { $gt: new Date() },
    });
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async addRefreshToken(userId, token, expiresAt) {
    return User.findByIdAndUpdate(
      userId,
      {
        $push: {
          refreshTokens: {
            token,
            expiresAt,
          },
        },
        $set: { lastLogin: new Date() },
      },
      { new: true }
    );
  }

  async removeRefreshToken(userId, token) {
    return User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          refreshTokens: { token },
        },
      },
      { new: true }
    );
  }

  async removeExpiredRefreshTokens(userId) {
    return User.findByIdAndUpdate(userId, {
      $pull: {
        refreshTokens: { expiresAt: { $lt: new Date() } },
      },
    });
  }

  async clearAllRefreshTokens(userId) {
    return User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }
}

module.exports = new UserRepository();
