/**
 * Notification Controller
 */

const notificationService = require('./notification.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class NotificationController {
  getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationService.getMyNotifications(req.user.id);
    const unreadCount = await notificationService.getUnreadCount(req.user.id);
    return ApiResponse.success(res, { notifications, unreadCount }, 'Notifications retrieved');
  });

  markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return ApiResponse.success(res, { notification }, 'Notification marked as read');
  });

  markAllAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAllAllRead ? await notificationService.markAllAsRead(req.user.id) : null;
    return ApiResponse.success(res, null, 'All notifications marked as read');
  });
}

module.exports = new NotificationController();
