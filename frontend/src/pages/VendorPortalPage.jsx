/**
 * VendorPortalPage Component
 *
 * Dedicated partner management workspace for venue owners & event service providers:
 * - Revenue metrics (Total earnings, Confirmed bookings, Active enquiries)
 * - Booking request management: Confirm, Reject, or Mark Completed
 * - My Listings portfolio view with quick edit indicators
 * - Client inquiry messaging inbox
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import {
  Briefcase, IndianRupee, CheckCircle2, Clock, XCircle,
  Building, Camera, Calendar, Users, Eye, Sparkles, AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';

export const VendorPortalPage = () => {
  const user = useSelector(selectCurrentUser);

  const [bookingRequests, setBookingRequests] = useState([
    {
      _id: 'bk_req_1',
      bookingNumber: 'VA-20261127-DEL81',
      customerName: 'Priya & Vikram Malhotra',
      customerEmail: 'priya.m@gmail.com',
      customerPhone: '+91 98200 12345',
      event: { name: 'Destination Sangeet & Reception', type: 'wedding', date: new Date(Date.now() + 30 * 86400000).toISOString(), guestCount: 450 },
      pricing: { totalAmount: 480000, advancePaid: 144000 },
      status: 'enquiry',
      notes: 'Requires outdoor garden cocktail lounge and high-gain power connection for live band.',
    },
    {
      _id: 'bk_req_2',
      bookingNumber: 'VA-20261125-MUM42',
      customerName: 'Sunil Chawla',
      customerEmail: 'sunil@chawlagroup.com',
      customerPhone: '+91 98111 54321',
      event: { name: 'Annual Leadership Gala', type: 'corporate', date: new Date(Date.now() + 15 * 86400000).toISOString(), guestCount: 220 },
      pricing: { totalAmount: 250000, advancePaid: 250000 },
      status: 'confirmed',
      notes: 'Full day banquet with projector setup and plated lunch.',
    },
  ]);

  const [listings, setListings] = useState([
    {
      id: 'l1',
      name: 'The Grand Heritage Palace & Royal Gardens',
      type: 'Palace / Farmhouse',
      city: 'Jaipur, Rajasthan',
      startingPrice: 350000,
      status: 'approved',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80',
      viewsCount: 1420,
      bookingsCount: 8,
    },
    {
      id: 'l2',
      name: 'Royal Courtyard Banquet & Terrace',
      type: 'Banquet Hall',
      city: 'Jaipur, Rajasthan',
      startingPrice: 180000,
      status: 'approved',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80',
      viewsCount: 890,
      bookingsCount: 4,
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setBookingRequests((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );
  };

  const totalRevenue = bookingRequests.reduce((acc, curr) => acc + curr.pricing.totalAmount, 0);
  const pendingRequests = bookingRequests.filter((b) => b.status === 'enquiry').length;
  const confirmedCount = bookingRequests.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Header Banner */}
      <div className="bg-primary text-white py-12 px-4 border-b border-primary-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-semibold tracking-wider uppercase mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Partner Portal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Vendor & Venue Manager
              </h1>
              <p className="mt-1 text-sm text-white/80 max-w-xl">
                Welcome back, {user?.name || 'Partner'}. Monitor reservation enquiries, approve bookings, and manage your luxury venue portfolios.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white text-white hover:text-primary border-white/20 self-start md:self-auto"
            >
              Add New Listing
            </Button>
          </div>

          {/* Quick Partner Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Gross Pipeline</p>
              <p className="text-2xl font-bold text-accent mt-0.5">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Pending Enquiries</p>
              <p className="text-2xl font-bold text-white mt-0.5">{pendingRequests}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Confirmed Events</p>
              <p className="text-2xl font-bold text-white mt-0.5">{confirmedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container pt-10 space-y-10">
        {/* Booking Requests Table */}
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-text">
                Incoming Client Booking Enquiries
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Review client guest counts, event dates, and approve or reject contracts
              </p>
            </div>
            <span className="text-xs font-semibold bg-primary-50 text-primary px-3 py-1 rounded-full">
              {bookingRequests.length} Total
            </span>
          </div>

          <div className="divide-y divide-border">
            {bookingRequests.map((req) => (
              <div key={req._id} className="p-6 hover:bg-neutral-50/50 transition-colors flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold bg-neutral-100 text-text px-2 py-0.5 rounded-md">
                      {req.bookingNumber}
                    </span>
                    <Badge
                      variant={
                        req.status === 'confirmed'
                          ? 'success'
                          : req.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="xs"
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-text">{req.event.name}</h4>
                    <p className="text-xs font-semibold text-primary">{req.customerName} ({req.customerPhone})</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(req.event.date, 'long')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      {req.event.guestCount} Guests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-primary" />
                      Contract: {formatCurrency(req.pricing.totalAmount)}
                    </span>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-text-muted bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 max-w-2xl">
                      <strong>Host Notes:</strong> {req.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col justify-end gap-2 shrink-0 self-end lg:self-center">
                  {req.status === 'enquiry' && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        onClick={() => handleUpdateStatus(req._id, 'confirmed')}
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        leftIcon={<XCircle className="w-4 h-4" />}
                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {req.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-700 bg-emerald-50 border-emerald-200"
                      leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      onClick={() => handleUpdateStatus(req._id, 'completed')}
                    >
                      Mark Event Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Managed Listings */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6">
          <h3 className="font-serif font-bold text-xl text-text mb-1">
            My Venue & Service Listings
          </h3>
          <p className="text-xs text-text-muted mb-6">
            Review performance, pricing tiers, and listing status
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((l) => (
              <div key={l.id} className="p-4 rounded-xl border border-border flex gap-4 hover:border-primary/40 transition-all">
                <img
                  src={l.image}
                  alt={l.name}
                  className="w-24 h-24 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge variant="success" size="xs">
                        {l.status}
                      </Badge>
                      <span className="text-[11px] text-text-muted font-mono">{l.viewsCount} views</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-text mt-1">{l.name}</h4>
                    <p className="text-xs text-text-muted">{l.city}</p>
                  </div>
                  <p className="text-xs font-bold text-primary">
                    Starting {formatCurrency(l.startingPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPortalPage;
