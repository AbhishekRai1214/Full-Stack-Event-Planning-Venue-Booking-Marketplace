import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from './chatApi';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      return await chatApi.getConversations();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const data = await chatApi.getMessages(conversationId);
      return { conversationId, messages: data.messages || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, text, attachments }, { rejectWithValue }) => {
    try {
      return await chatApi.sendMessage(conversationId, { text, attachments });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);

export const startConversation = createAsyncThunk(
  'chat/startConversation',
  async (payload, { rejectWithValue }) => {
    try {
      return await chatApi.startConversation(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to start conversation');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    activeConversation: null,
    messages: [],
    loading: false,
    messagesLoading: false,
    error: null,
    typingUsers: {}, // { [conversationId]: [userIds] }
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    messageReceived: (state, action) => {
      const message = action.payload;
      // If belongs to active conversation, append
      if (state.activeConversation && state.activeConversation._id === message.conversation) {
        // Prevent duplicates
        if (!state.messages.some((m) => m._id === message._id)) {
          state.messages.push(message);
        }
      }

      // Update lastMessage on conversation list
      const conv = state.conversations.find((c) => c._id === message.conversation);
      if (conv) {
        conv.lastMessage = {
          text: message.text,
          sender: message.sender?._id || message.sender,
          createdAt: message.createdAt,
        };
        conv.updatedAt = message.createdAt;
      }
    },
    setTyping: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
          (id) => id !== userId
        );
      }
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.messagesLoading = false;
      })
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        if (!state.messages.some((m) => m._id === message._id)) {
          state.messages.push(message);
        }
      })
      // startConversation
      .addCase(startConversation.fulfilled, (state, action) => {
        const conv = action.payload;
        if (!state.conversations.some((c) => c._id === conv._id)) {
          state.conversations.unshift(conv);
        }
        state.activeConversation = conv;
      });
  },
});

export const {
  setActiveConversation,
  messageReceived,
  setTyping,
  clearActiveConversation,
} = chatSlice.actions;

export const selectConversations = (state) => state.chat.conversations;
export const selectActiveConversation = (state) => state.chat.activeConversation;
export const selectChatMessages = (state) => state.chat.messages;
export const selectChatLoading = (state) => state.chat.loading;
export const selectMessagesLoading = (state) => state.chat.messagesLoading;
export const selectTypingUsers = (state) => state.chat.typingUsers;

export default chatSlice.reducer;
