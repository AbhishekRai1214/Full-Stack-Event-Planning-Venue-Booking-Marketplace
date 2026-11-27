/**
 * Notification Service & Repository
 */

const Notification = require('./notification.model');

class NotificationService {
  async createNotification({ recipient, type, title, message, data = {} }) {
    return Notification.create({ recipient, type, title, message, data });
  }

  async getMyNotifications(userId) {
    return Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(50);
  }

  async getUnreadCount(userId) {
    return Notification.countDocuments({ recipient: userId, isRead: false });
  }

  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }
}

module.exports = new NotificationService();
