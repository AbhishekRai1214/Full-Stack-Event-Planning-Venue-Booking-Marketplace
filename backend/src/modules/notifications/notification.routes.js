/**
 * Notification Routes
 */

const express = require('express');
const notificationController = require('./notification.controller');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;
