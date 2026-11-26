/**
 * BookingsPage – Customer Bookings Dashboard
 *
 * Shows all of the authenticated user's venue and vendor bookings
 * grouped by active/completed/cancelled with summary stats at the top.
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyBookings,
  selectAllBookings,
  selectBookingsLoading,
} from '@/features/bookings/bookingsSlice';
import BookingCard from '@/features/bookings/components/BookingCard';
import Spinner from '@/components/common/Spinner';
import { CalendarDays, Building, Camera, CheckCircle2, Clock, XCircle } from 'lucide-react';

const TAB_FILTERS = [
  { label: 'All',       icon: CalendarDays,  filter: null },
  { label: 'Active',    icon: Clock,         filter: ['enquiry', 'confirmed', 'advance_paid', 'fully_paid'] },
  { label: 'Completed', icon: CheckCircle2,  filter: ['completed'] },
  { label: 'Cancelled', icon: XCircle,       filter: ['cancelled', 'rejected'] },
];

export const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const bookings = useSelector(selectAllBookings);
  const isLoading = useSelector(selectBookingsLoading);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const filteredBookings = TAB_FILTERS[activeTab].filter
    ? bookings.filter((b) => TAB_FILTERS[activeTab].filter.includes(b.status))
    : bookings;

  // Summary stats
  const venueCount  = bookings.filter((b) => b.bookingType === 'venue').length;
  const vendorCount = bookings.filter((b) => b.bookingType === 'vendor').length;
  const activeCount = bookings.filter((b) =>
    ['enquiry', 'confirmed', 'advance_paid', 'fully_paid'].includes(b.status)
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white py-10 px-4">
        <div className="section-container">
          <h1 className="text-3xl font-serif font-bold mb-1">My Bookings & Enquiries</h1>
          <p className="text-sm text-white/80 mb-8">
            Track all venue bookings and vendor enquiries across your celebrations
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15">
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Total Bookings</p>
              <p className="text-2xl font-bold text-accent mt-0.5">{bookings.length}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Venue Bookings</p>
              <p className="text-2xl font-bold text-white mt-0.5">{venueCount}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Vendor Enquiries</p>
              <p className="text-2xl font-bold text-white mt-0.5">{vendorCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border sticky top-14 z-30">
        <div className="section-container flex gap-1 overflow-x-auto pb-px">
          {TAB_FILTERS.map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === idx
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      <div className="section-container pt-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" text="Loading your bookings..." />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border shadow-card max-w-md mx-auto p-8">
            <CalendarDays className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-text mb-2">No Bookings Yet</h3>
            <p className="text-sm text-text-muted">
              {activeTab === 0
                ? 'Browse venues and vendors to place your first booking.'
                : `No ${TAB_FILTERS[activeTab].label.toLowerCase()} bookings found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id || booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
