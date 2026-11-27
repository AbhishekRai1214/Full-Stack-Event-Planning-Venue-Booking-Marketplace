/**
 * BookingDetailPage – Full Booking Details
 *
 * Shows:
 * - Booking state machine timeline
 * - Full event details
 * - Venue/vendor details with cover image
 * - Pricing breakdown with advance payment progress
 * - Notes from customer and vendor
 * - Cancellation info (if cancelled)
 * - Action buttons based on user role and current status
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingById,
  selectCurrentBooking,
  selectBookingsLoading,
  cancelBooking,
} from '@/features/bookings/bookingsSlice';
import BookingTimeline from '@/features/bookings/components/BookingTimeline';
import BookingStatusBadge from '@/features/bookings/components/BookingStatusBadge';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import Modal from '@/components/common/Modal';
import {
  ArrowLeft, Calendar, Users, Building, Camera,
  FileText, AlertTriangle, XCircle, IndianRupee,
  CreditCard, CheckCircle2,
} from 'lucide-react';
import PaymentModal from '@/features/payments/PaymentModal';
import { formatCurrency, formatDate, formatEventType } from '@/utils';

export const BookingDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booking = useSelector(selectCurrentBooking);
  const isLoading = useSelector(selectBookingsLoading);

  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState('advance');

  useEffect(() => {
    if (id) dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  if (isLoading || !booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" text="Loading booking details..." />
      </div>
    );
  }

  const isVenue    = booking.bookingType === 'venue';
  const target     = isVenue ? booking.venue : booking.vendor;
  const targetImg  = isVenue ? target?.images?.[0]?.url : target?.image;
  const canCancel  = ['enquiry', 'confirmed'].includes(booking.status);

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    dispatch(cancelBooking({ id: booking._id || booking.id, reason: cancelReason }));
    setCancelModal(false);
  };

  const paidPercent = booking.pricing?.totalAmount > 0
    ? Math.min(100, Math.round(((booking.pricing?.advancePaid || 0) / booking.pricing.totalAmount) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Nav bar */}
      <div className="bg-white border-b border-border py-4 px-4">
        <div className="section-container flex items-center justify-between">
          <Link to="/bookings" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Bookings
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted">{booking.bookingNumber}</span>
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>
      </div>

      {/* Hero – target image */}
      <div className="relative h-56 bg-neutral-200 overflow-hidden">
        <img
          src={targetImg || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
          alt={target?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isVenue ? 'bg-primary/80 text-white' : 'bg-accent/80 text-white'
            }`}>
              {isVenue ? '🏛 Venue Booking' : '📸 Vendor Enquiry'}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">{target?.name || 'Booking'}</h1>
          <p className="text-sm text-white/80">{target?.city}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="section-container pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* State Machine Timeline */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
              <h2 className="font-serif font-bold text-lg text-text mb-6">Booking Journey</h2>
              <BookingTimeline status={booking.status} />
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
              <h2 className="font-serif font-bold text-lg text-text mb-4">Event Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Event Name</p>
                  <p className="font-medium text-text mt-0.5">{booking.event?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Event Type</p>
                  <p className="font-medium text-text mt-0.5">{formatEventType(booking.event?.type)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Date</p>
                  <p className="font-medium text-text mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {formatDate(booking.event?.date, 'long')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Guests</p>
                  <p className="font-medium text-text mt-0.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    {booking.event?.guestCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(booking.notes || booking.vendorNotes) && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-card space-y-4">
                <h2 className="font-serif font-bold text-lg text-text">Notes & Communication</h2>
                {booking.notes && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Your Notes</p>
                    <p className="text-sm text-text leading-relaxed bg-neutral-50 p-3 rounded-xl border border-border">
                      {booking.notes}
                    </p>
                  </div>
                )}
                {booking.vendorNotes && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                      Response from {isVenue ? 'Venue' : 'Vendor'}
                    </p>
                    <p className="text-sm text-text leading-relaxed bg-primary-50/50 p-3 rounded-xl border border-primary-100">
                      {booking.vendorNotes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cancellation Info */}
            {(booking.status === 'cancelled' || booking.status === 'rejected') && booking.cancellation?.reason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-red-700 font-semibold text-sm mb-2">
                  <XCircle className="w-4 h-4" /> Cancellation Details
                </div>
                <p className="text-xs text-red-600">{booking.cancellation.reason}</p>
              </div>
            )}
          </div>

          {/* Right col – Pricing + Actions */}
          <div className="space-y-6">
            {/* Pricing breakdown */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
              <h3 className="font-serif font-bold text-base text-text flex items-center gap-1.5 mb-4 pb-3 border-b border-border">
                <IndianRupee className="w-4 h-4 text-primary" /> Payment Summary
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Base Amount</span>
                  <span>{formatCurrency(booking.pricing?.baseAmount)}</span>
                </div>
                {booking.pricing?.taxes > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>GST (18%)</span>
                    <span>{formatCurrency(booking.pricing.taxes)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-text pt-2 border-t border-border">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(booking.pricing?.totalAmount)}</span>
                </div>
              </div>

              {/* Advance payment bar */}
              {booking.pricing?.advanceRequired > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-xs text-text-muted mb-1.5">
                    <span>Advance Required (30%)</span>
                    <span className="font-semibold text-text">{formatCurrency(booking.pricing.advanceRequired)}</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${paidPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">
                    Paid: {formatCurrency(booking.pricing?.advancePaid || 0)} ({paidPercent}%)
                  </p>
                </div>
              )}

              {/* Payment CTA Buttons */}
              {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                <div className="mt-4 pt-4 border-t border-border">
                  {(booking.pricing?.advancePaid || 0) < (booking.pricing?.advanceRequired || (booking.pricing?.totalAmount * 0.3)) ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center shadow-md shadow-primary/20"
                      leftIcon={<CreditCard className="w-4 h-4" />}
                      onClick={() => {
                        setPaymentType('advance');
                        setPaymentModal(true);
                      }}
                    >
                      Pay Advance Deposit ({formatCurrency(booking.pricing?.advanceRequired || Math.round((booking.pricing?.totalAmount || 0) * 0.3))})
                    </Button>
                  ) : (booking.pricing?.advancePaid || 0) < (booking.pricing?.totalAmount || 0) ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                      leftIcon={<CreditCard className="w-4 h-4" />}
                      onClick={() => {
                        setPaymentType('balance');
                        setPaymentModal(true);
                      }}
                    >
                      Pay Remaining Balance ({formatCurrency((booking.pricing?.totalAmount || 0) - (booking.pricing?.advancePaid || 0))})
                    </Button>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Fully Paid & Confirmed
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {canCancel && (
              <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
                <h3 className="font-serif font-bold text-base text-text mb-3">Booking Actions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-red-600 hover:border-red-300 hover:bg-red-50"
                  leftIcon={<XCircle className="w-4 h-4" />}
                  onClick={() => setCancelModal(true)}
                >
                  Cancel This Booking
                </Button>
                <p className="text-[10px] text-text-muted mt-2 text-center">
                  Cancellation may incur charges per venue/vendor policy.
                </p>
              </div>
            )}

            {/* Contact link */}
            <div className="bg-primary-50/70 border border-primary-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-text-muted mb-2">Need help with this booking?</p>
              <Link to="/contact" className="text-xs font-semibold text-primary hover:underline">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Booking" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Cancelling <strong className="mx-1">{booking.bookingNumber}</strong> may incur a fee. Refund (if applicable) takes 5–7 business days.
          </div>
          <div>
            <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
              Reason for Cancellation *
            </label>
            <textarea
              rows="3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please explain the reason..."
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button size="sm" variant="ghost" onClick={() => setCancelModal(false)}>Keep Booking</Button>
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

      {/* Razorpay Payment Modal */}
      <PaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        booking={booking}
        paymentType={paymentType}
        onSuccess={() => {
          if (id) dispatch(fetchBookingById(id));
        }}
      />
    </div>
  );
};

export default BookingDetailPage;
