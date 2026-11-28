/**
 * Chat Routes – Phase 14
 *
 * REST endpoints for real-time messaging, threads, and message history.
 */

const express = require('express');
const chatController = require('./chat.controller');
const { authenticate } = require('../../middleware/authenticate');
const { validate } = require('../../middleware/validate');
const { startConversationSchema, sendMessageSchema } = require('./chat.validation');

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);

// Get conversations list
router.get('/conversations', chatController.getConversations);

// Start or get existing conversation
router.post(
  '/conversations',
  validate(startConversationSchema, 'body'),
  chatController.startConversation
);

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', chatController.getMessages);

// Send message via REST
router.post(
  '/conversations/:conversationId/messages',
  validate(sendMessageSchema, 'body'),
  chatController.sendMessage
);

// Mark conversation messages as read
router.put('/conversations/:conversationId/read', chatController.markAsRead);

module.exports = router;
