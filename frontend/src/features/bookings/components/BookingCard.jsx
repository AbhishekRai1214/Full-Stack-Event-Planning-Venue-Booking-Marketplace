/**
 * BookingCard Component
 *
 * Displays a single booking in the customer's bookings dashboard:
 * - Booking number, type badge, and status badge
 * - Venue/vendor cover image, name, city
 * - Event details (type, date, guest count)
 * - Pricing summary and advance payment progress
 * - Quick action: view details / cancel
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Calendar, Users, Building, Camera, ArrowRight,
  XCircle, AlertTriangle,
} from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { cancelBooking } from '../bookingsSlice';
import { formatCurrency, formatDate } from '@/utils';

export const BookingCard = ({ booking }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const dispatch = useDispatch();

  const bid = booking._id || booking.id;
  const isVenue = booking.bookingType === 'venue';
  const target = isVenue ? booking.venue : booking.vendor;
  const targetImage = isVenue
    ? target?.images?.[0]?.url
    : target?.image;
  const canCancel = ['enquiry', 'confirmed'].includes(booking.status);

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    dispatch(cancelBooking({ id: bid, reason: cancelReason }));
    setShowCancelModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
        {/* Cover Image */}
        <div className="w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-neutral-100 overflow-hidden">
          <img
            src={
              targetImage ||
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'
            }
            alt={target?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between gap-3">
          {/* Top Row: Booking # + badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-text bg-neutral-100 px-2 py-0.5 rounded-md">
                {booking.bookingNumber}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isVenue
                  ? 'bg-primary/10 text-primary'
                  : 'bg-accent/10 text-accent-700'
              }`}>
                {isVenue ? '🏛 Venue' : '📸 Vendor'}
              </span>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          {/* Target name */}
          <div>
            <h3 className="font-serif font-bold text-base text-text flex items-center gap-1.5">
              {isVenue ? (
                <Building className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Camera className="w-4 h-4 text-accent shrink-0" />
              )}
              {target?.name || 'Service Provider'}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">{target?.city}</p>
          </div>

          {/* Event Details Row */}
          <div className="flex flex-wrap gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {formatDate(booking.event?.date, 'long')}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              {booking.event?.guestCount} guests
            </span>
          </div>

          {/* Pricing + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
            <div className="space-y-0.5">
              <div className="text-xs text-text-muted">Total Amount</div>
              <div className="text-sm font-bold text-text">
                {formatCurrency(booking.pricing?.totalAmount)}
              </div>
              {booking.pricing?.advanceRequired > 0 && (
                <div className="text-[11px] text-text-muted">
                  Advance:{' '}
                  <span className={
                    booking.pricing.advancePaid >= booking.pricing.advanceRequired
                      ? 'text-green-600 font-semibold'
                      : 'text-amber-600 font-semibold'
                  }>
                    {formatCurrency(booking.pricing.advancePaid)} /{' '}
                    {formatCurrency(booking.pricing.advanceRequired)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {canCancel && (
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel
                </Button>
              )}
              <Link
                to={`/bookings/${bid}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Cancelling <strong>{booking.bookingNumber}</strong> may incur a cancellation fee
              as per the venue/vendor policy. Refund (if applicable) will be processed within 5–7 business days.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
              Reason for Cancellation *
            </label>
            <textarea
              rows="3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a brief reason for cancellation..."
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button size="sm" variant="ghost" onClick={() => setShowCancelModal(false)}>
              Keep Booking
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancel}
              disabled={!cancelReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingCard;
