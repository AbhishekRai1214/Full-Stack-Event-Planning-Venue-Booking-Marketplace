import { io } from 'socket.io-client';
import { getAccessToken } from './api';

let socket = null;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const connectSocket = (user) => {
  if (socket && socket.connected) return socket;

  const token = getAccessToken();

  socket = io(SOCKET_URL, {
    auth: {
      token: token ? `Bearer ${token}` : undefined,
      userId: user?._id || user?.id,
      role: user?.role,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    // Connected to Socket.io server
  });

  socket.on('connect_error', () => {
    // Connect error handled gracefully
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinConversation = (conversationId) => {
  if (socket && conversationId) {
    socket.emit('join_conversation', conversationId);
  }
};

export const leaveConversation = (conversationId) => {
  if (socket && conversationId) {
    socket.emit('leave_conversation', conversationId);
  }
};

export const emitTyping = (conversationId, isTyping) => {
  if (socket && conversationId) {
    socket.emit(isTyping ? 'typing_start' : 'typing_stop', { conversationId });
  }
};

export default {
  connectSocket,
  getSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  emitTyping,
};
