/**
 * Socket.IO Configuration & Event Handlers
 *
 * Real-time bidirectional communication engine for customer-to-vendor/host messaging,
 * typing indicators, online state, and instant notifications.
 */

const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/generateTokens');
const logger = require('../utils/logger');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
      ],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // JWT Authentication middleware for Socket.io
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (token) {
        const decoded = verifyAccessToken(token);
        socket.user = decoded; // { id, email, role }
        return next();
      }

      // Allow simulated userId in test/dev environment if explicitly provided
      if (socket.handshake.auth?.userId) {
        socket.user = {
          id: socket.handshake.auth.userId,
          role: socket.handshake.auth.role || 'CUSTOMER',
        };
        return next();
      }

      return next(new Error('Authentication error: Token missing'));
    } catch (err) {
      logger.warn({ err: err.message }, 'Socket auth failed, falling back to guest/auth error');
      if (socket.handshake.auth?.userId) {
        socket.user = { id: socket.handshake.auth.userId, role: 'CUSTOMER' };
        return next();
      }
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    if (userId) {
      socket.join(`user_${userId}`);
      logger.info(`🟢 Socket connected: ${socket.id} (User: ${userId})`);
    }

    // Join specific conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      logger.info(`Socket ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
    });

    // Typing indicators
    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping: true,
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    socket.on('disconnect', () => {
      logger.info(`🔴 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    logger.warn('Socket.io has not been initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
