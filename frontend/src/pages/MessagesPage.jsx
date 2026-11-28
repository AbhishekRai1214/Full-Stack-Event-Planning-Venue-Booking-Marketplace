import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageSquare,
  Send,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Search,
  Building,
  Camera,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowLeft,
  X,
} from 'lucide-react';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
  setActiveConversation,
  messageReceived,
  setTyping,
  selectConversations,
  selectActiveConversation,
  selectChatMessages,
  selectChatLoading,
  selectMessagesLoading,
  selectTypingUsers,
} from '../features/chat/chatSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import {
  connectSocket,
  joinConversation,
  leaveConversation,
  emitTyping,
  getSocket,
} from '../services/socket';
import { chatApi } from '../features/chat/chatApi';
import { paymentsApi } from '../features/payments/paymentsApi';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const MessagesPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const currentUser = useSelector(selectCurrentUser);
  const conversations = useSelector(selectConversations);
  const activeConversation = useSelector(selectActiveConversation);
  const messages = useSelector(selectChatMessages);
  const loading = useSelector(selectChatLoading);
  const messagesLoading = useSelector(selectMessagesLoading);
  const typingUsers = useSelector(selectTypingUsers);

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize socket connection & global listeners
  useEffect(() => {
    if (!currentUser) return;

    const socket = connectSocket(currentUser);

    const handleReceiveMessage = (msg) => {
      dispatch(messageReceived(msg));
      if (activeConversation && activeConversation._id === msg.conversation) {
        chatApi.markAsRead(msg.conversation);
      }
    };

    const handleUserTyping = (data) => {
      dispatch(setTyping(data));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [currentUser, activeConversation, dispatch]);

  // Load user conversations
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Handle URL query parameters to auto-start/select conversation
  useEffect(() => {
    const venueId = searchParams.get('venueId');
    const vendorId = searchParams.get('vendorId');
    const bookingId = searchParams.get('bookingId');
    const recipientId = searchParams.get('recipientId');

    if (venueId || vendorId || bookingId || recipientId) {
      dispatch(
        startConversation({
          venueId,
          vendorId,
          bookingId,
          recipientId,
          initialMessage: searchParams.get('initialMessage') || undefined,
        })
      );
    }
  }, [searchParams, dispatch]);

  // Handle active conversation room change
  useEffect(() => {
    if (activeConversation?._id) {
      joinConversation(activeConversation._id);
      dispatch(fetchMessages(activeConversation._id));
      chatApi.markAsRead(activeConversation._id);
      setIsMobileListVisible(false);

      return () => {
        leaveConversation(activeConversation._id);
      };
    }
  }, [activeConversation?._id, dispatch]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSelectConversation = (conv) => {
    dispatch(setActiveConversation(conv));
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    if (activeConversation?._id) {
      emitTyping(activeConversation._id, true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitTyping(activeConversation._id, false);
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if ((!messageText.trim() && !attachedImage) || !activeConversation?._id) return;

    const textToSend = messageText.trim() || 'Attached an image';
    const attachments = attachedImage
      ? [{ url: attachedImage, type: 'image', name: 'Photo' }]
      : [];

    setMessageText('');
    setAttachedImage(null);
    emitTyping(activeConversation._id, false);

    await dispatch(
      sendMessage({
        conversationId: activeConversation._id,
        text: textToSend,
        attachments,
      })
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await paymentsApi.uploadImage(file, 'venueaura/chat');
      if (res?.url) {
        setAttachedImage(res.url);
      }
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper to determine the other party's display details
  const getConversationDetails = (conv) => {
    if (!conv) return { name: 'Chat', subtitle: '', image: '' };

    if (conv.venue) {
      return {
        name: conv.venue.name,
        subtitle: `Venue Host • ${conv.venue.location?.city || 'India'}`,
        image: conv.venue.images?.[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
        badge: 'Venue Host',
        link: `/venues/${conv.venue.slug || conv.venue._id}`,
      };
    }

    if (conv.vendor) {
      return {
        name: conv.vendor.businessName,
        subtitle: `Vendor • ${conv.vendor.category || 'Event Service'}`,
        image: conv.vendor.images?.[0]?.url || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80',
        badge: 'Vendor',
        link: `/vendors/${conv.vendor.slug || conv.vendor._id}`,
      };
    }

    // Direct User participant
    const otherUser = conv.participants?.find((p) => p._id !== currentUser?._id) || conv.participants?.[0];
    return {
      name: otherUser?.name || 'Customer',
      subtitle: otherUser?.role || 'User',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: otherUser?.role || 'User',
      link: null,
    };
  };

  const filteredConversations = conversations.filter((c) => {
    const details = getConversationDetails(c);
    return details.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeDetails = getConversationDetails(activeConversation);
  const isTyping = activeConversation?._id && (typingUsers[activeConversation._id]?.length || 0) > 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/60 py-6">
      <div className="section-container h-[calc(100vh-120px)] max-h-[850px] bg-white rounded-3xl border border-border shadow-card overflow-hidden flex flex-col md:flex-row">
        {/* ─── Left Column: Conversation Sidebar ───────────────────────────── */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-white shrink-0 ${
            !isMobileListVisible ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-bold text-lg text-text">Messages</h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-50 text-primary font-semibold">
              {conversations.length}
            </span>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-border/60">
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {loading ? (
              <div className="p-8 text-center text-text-muted">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                <p className="text-xs">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-text">No conversations yet</p>
                <p className="text-[11px] mt-1">
                  Start an inquiry from any venue or vendor detail page.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const details = getConversationDetails(conv);
                const isSelected = activeConversation?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-primary-50/70 border-l-4 border-primary'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={details.image}
                        alt={details.name}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-text truncate">{details.name}</h4>
                        <span className="text-[10px] text-text-muted shrink-0">
                          {conv.updatedAt
                            ? new Date(conv.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted truncate">
                        {conv.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ─── Right Column: Active Chat Area ──────────────────────────────── */}
        <div
          className={`flex-1 flex flex-col bg-neutral-50/40 ${
            isMobileListVisible ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-border flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMobileListVisible(true)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-neutral-100 text-text-muted"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={activeDetails.image}
                    alt={activeDetails.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-text">{activeDetails.name}</h3>
                      <Badge variant="primary" size="xs">
                        {activeDetails.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-muted flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      {activeDetails.subtitle}
                    </p>
                  </div>
                </div>

                {activeDetails.link && (
                  <Link
                    to={activeDetails.link}
                    className="text-xs font-semibold text-primary hover:underline hidden sm:inline-block"
                  >
                    View Listing →
                  </Link>
                )}
              </div>

              {/* Message History Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messagesLoading ? (
                  <div className="h-full flex items-center justify-center text-text-muted">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-text-muted p-8">
                    <Sparkles className="w-10 h-10 text-primary/40 mb-2" />
                    <p className="text-sm font-serif font-bold text-text">Say Hello!</p>
                    <p className="text-xs text-text-muted max-w-sm mt-1">
                      Discuss guest capacity, custom decor requirements, package details or event dates directly.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine =
                      msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed ${
                            isMine
                              ? 'bg-primary text-white rounded-br-xs'
                              : 'bg-white border border-border text-text rounded-bl-xs'
                          }`}
                        >
                          {msg.attachments?.length > 0 && (
                            <div className="mb-2 rounded-xl overflow-hidden">
                              <img
                                src={msg.attachments[0].url}
                                alt="Attachment"
                                className="w-full max-h-56 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-text-muted mt-1 px-1">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMine && (
                            <CheckCheck className="w-3.5 h-3.5 text-primary-400" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-text-muted bg-white border border-border py-2 px-3 rounded-full w-fit animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>{activeDetails.name} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="p-3 bg-white border-t border-border">
                {attachedImage && (
                  <div className="relative inline-block mb-2 ml-2">
                    <img
                      src={attachedImage}
                      alt="Upload preview"
                      className="w-16 h-16 object-cover rounded-xl border border-primary/40 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setAttachedImage(null)}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-0.5 rounded-full shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="p-2.5 rounded-xl border border-border hover:bg-neutral-50 text-text-muted hover:text-text transition-colors"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </button>

                  <input
                    type="text"
                    value={messageText}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-2.5 bg-neutral-50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="px-4 py-2.5 rounded-xl justify-center"
                    disabled={!messageText.trim() && !attachedImage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            // No Conversation Selected State
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-muted">
              <div className="w-16 h-16 rounded-full bg-primary-50 text-primary flex items-center justify-center mb-4 shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-text">Your Event Messaging Hub</h3>
              <p className="text-xs text-text-muted max-w-sm mt-1 mb-6">
                Connect directly in real-time with venue managers, wedding decorators, caterers, and photographers.
              </p>
              <Link to="/venues">
                <Button variant="primary" size="sm">
                  Browse Venues to Inquire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
