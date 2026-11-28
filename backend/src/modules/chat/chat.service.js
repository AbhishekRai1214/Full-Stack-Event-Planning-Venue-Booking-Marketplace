/**
 * Chat Service
 *
 * Implements conversational messaging logic, room dispatching, read receipts,
 * and integration with Socket.io real-time broadcast engine.
 */

const Conversation = require('./conversation.model');
const Message = require('./message.model');
const Venue = require('../venues/venue.model');
const Vendor = require('../vendors/vendor.model');
const Booking = require('../bookings/booking.model');
const ApiError = require('../../utils/ApiError');
const { getIO } = require('../../config/socket');

class ChatService {
  /**
   * Get all conversations for a specific user
   */
  async getUserConversations(userId) {
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email role phone')
      .populate('venue', 'name slug images location')
      .populate('vendor', 'businessName slug images category')
      .populate('booking', 'bookingNumber eventDate status pricing')
      .sort({ updatedAt: -1 });

    return conversations;
  }

  /**
   * Get or start a conversation
   */
  async getOrCreateConversation(userId, { recipientId, venueId, vendorId, bookingId, initialMessage }) {
    let finalRecipientId = recipientId;
    let venue = null;
    let vendor = null;
    let booking = null;

    if (venueId) {
      venue = await Venue.findById(venueId);
      if (venue && venue.owner) {
        finalRecipientId = venue.owner.toString();
      }
    }

    if (vendorId) {
      vendor = await Vendor.findById(vendorId);
      if (vendor && vendor.user) {
        finalRecipientId = vendor.user.toString();
      }
    }

    if (bookingId) {
      booking = await Booking.findById(bookingId);
      if (booking && !finalRecipientId) {
        if (booking.customer.toString() === userId.toString()) {
          // If customer initiated, recipient is venue/vendor owner
          if (booking.venue) {
            const bVenue = await Venue.findById(booking.venue);
            if (bVenue?.owner) finalRecipientId = bVenue.owner.toString();
          } else if (booking.vendor) {
            const bVendor = await Vendor.findById(booking.vendor);
            if (bVendor?.user) finalRecipientId = bVendor.user.toString();
          }
        } else {
          // Recipient is customer
          finalRecipientId = booking.customer.toString();
        }
      }
    }

    if (!finalRecipientId || finalRecipientId === userId.toString()) {
      // In case no distinct owner was configured or user is contacting self in dev/mock,
      // allow fallback to support seeded venue/vendor contact
      finalRecipientId = recipientId || userId.toString();
    }

    // Check for existing conversation with these participants
    const query = {
      participants: { $all: [userId, finalRecipientId] },
    };
    if (venueId) query.venue = venueId;
    if (vendorId) query.vendor = vendorId;

    let conversation = await Conversation.findOne(query)
      .populate('participants', 'name email role phone')
      .populate('venue', 'name slug images location')
      .populate('vendor', 'businessName slug images category')
      .populate('booking', 'bookingNumber eventDate status pricing');

    if (!conversation) {
      const participants = Array.from(new Set([userId.toString(), finalRecipientId.toString()]));

      conversation = await Conversation.create({
        participants,
        venue: venueId || null,
        vendor: vendorId || null,
        booking: bookingId || null,
        lastMessage: {
          text: initialMessage || 'Conversation started',
          sender: userId,
          createdAt: new Date(),
          readBy: [userId],
        },
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email role phone')
        .populate('venue', 'name slug images location')
        .populate('vendor', 'businessName slug images category')
        .populate('booking', 'bookingNumber eventDate status pricing');
    }

    // If an initial message was passed, persist it
    if (initialMessage) {
      await this.sendMessage(conversation._id, userId, { text: initialMessage });
    }

    return conversation;
  }

  /**
   * Get paginated messages for a conversation
   */
  async getMessages(conversationId, userId, { page = 1, limit = 50 }) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, 'Conversation not found');

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      throw new ApiError(403, 'You are not a participant in this conversation');
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ conversation: conversationId });

    return {
      messages,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Send a new message inside a conversation
   */
  async sendMessage(conversationId, senderId, { text, attachments = [] }) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, 'Conversation not found');

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === senderId.toString()
    );
    if (!isParticipant) {
      throw new ApiError(403, 'You are not a participant in this conversation');
    }

    const receiverId = conversation.participants.find(
      (p) => p.toString() !== senderId.toString()
    ) || senderId;

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      receiver: receiverId,
      text,
      attachments,
      readBy: [{ user: senderId, readAt: new Date() }],
    });

    const populatedMessage = await Message.findById(message._id).populate(
      'sender',
      'name email role'
    );

    // Update conversation last message & timestamp
    conversation.lastMessage = {
      text,
      sender: senderId,
      createdAt: message.createdAt,
      readBy: [senderId],
    };
    await conversation.save();

    // Broadcast via Socket.IO
    try {
      const io = getIO();
      if (io) {
        // Broadcast to active conversation room
        io.to(`conversation_${conversationId}`).emit('receive_message', populatedMessage);

        // Alert recipient's personal user room
        io.to(`user_${receiverId}`).emit('new_message_alert', {
          conversationId,
          message: populatedMessage,
        });
      }
    } catch {
      // Ignore socket dispatch errors in headless test runs
    }

    return populatedMessage;
  }

  /**
   * Mark all unread messages in conversation as read
   */
  async markAsRead(conversationId, userId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, 'Conversation not found');

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId },
      },
      {
        $addToSet: { readBy: { user: userId, readAt: new Date() } },
      }
    );

    if (conversation.lastMessage) {
      if (!conversation.lastMessage.readBy.some((u) => u.toString() === userId.toString())) {
        conversation.lastMessage.readBy.push(userId);
        await conversation.save();
      }
    }

    try {
      const io = getIO();
      if (io) {
        io.to(`conversation_${conversationId}`).emit('messages_read', {
          conversationId,
          userId,
        });
      }
    } catch {
      // Socket ignore
    }

    return { success: true };
  }
}

module.exports = new ChatService();
