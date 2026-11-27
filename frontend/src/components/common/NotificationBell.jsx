/**
 * NotificationBell Component
 *
 * Header bell icon with real-time unread badge counter and popover list
 * for booking confirmations, vendor approvals, and status alerts.
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { notificationsApi } from '@/services/phase11Api';
import { Bell, Check, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/utils';

export const NotificationBell = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      _id: 'n1',
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: 'The Oberoi Rajvilas confirmed your reservation for Dec 15.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
    },
    {
      _id: 'n2',
      type: 'general',
      title: 'Welcome to VenueAura',
      message: 'Explore handpicked luxury palaces and verified vendors for your events.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      notificationsApi.getMyNotifications().then((res) => {
        if (res.notifications && res.notifications.length > 0) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount || 0);
        }
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleMarkSingleRead = async (id) => {
    await notificationsApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-muted hover:text-primary hover:bg-neutral-100 rounded-button transition-colors relative"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-dropdown border border-border py-3 z-50 animate-scale-in">
          {/* Header */}
          <div className="px-4 pb-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-text">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-primary-50 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-primary hover:underline font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkSingleRead(n._id)}
                  className={`p-3.5 hover:bg-neutral-50 transition-colors cursor-pointer flex gap-3 ${
                    !n.isRead ? 'bg-primary-50/30' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{n.title}</p>
                    <p className="text-[11px] text-text-muted line-clamp-2 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      {formatDate(n.createdAt, 'relative')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
