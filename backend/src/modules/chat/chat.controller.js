/**
 * Chat Controller
 *
 * REST interface for conversation management, messaging history, and read receipts.
 */

const chatService = require('./chat.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * Get all conversations for logged in user
 */
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await chatService.getUserConversations(req.user.id);
  return ApiResponse.success(res, 200, 'Conversations retrieved', conversations);
});

/**
 * Start or retrieve a conversation
 */
const startConversation = asyncHandler(async (req, res) => {
  const conversation = await chatService.getOrCreateConversation(req.user.id, req.validatedBody);
  return ApiResponse.success(res, 201, 'Conversation initiated', conversation);
});

/**
 * Get messages of a conversation
 */
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  const result = await chatService.getMessages(conversationId, req.user.id, { page, limit });
  return ApiResponse.success(res, 200, 'Messages retrieved', result);
});

/**
 * Send a message via REST
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const message = await chatService.sendMessage(conversationId, req.user.id, req.validatedBody);
  return ApiResponse.success(res, 201, 'Message sent successfully', message);
});

/**
 * Mark messages in a conversation as read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const result = await chatService.markAsRead(conversationId, req.user.id);
  return ApiResponse.success(res, 200, 'Messages marked as read', result);
});

module.exports = {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  markAsRead,
};
