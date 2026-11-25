/**
 * EventDetailPage Component
 *
 * Comprehensive event management dashboard:
 * - Event header with countdown timer and status tag
 * - Linked venue card with booking status
 * - Interactive checklist management
 * - Notes & coordination summary
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEventById,
  selectCurrentEvent,
  selectEventsLoading,
  removeEvent,
} from '@/features/events/eventsSlice';
import EventChecklist from '@/features/events/components/EventChecklist';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Spinner from '@/components/common/Spinner';
import {
  Calendar,
  MapPin,
  Users,
  Building,
  ArrowLeft,
  Trash2,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';

export const EventDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const event = useSelector(selectCurrentEvent);
  const isLoading = useSelector(selectEventsLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id]);

  if (isLoading || !event) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" text="Loading celebration details..." />
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event plan?')) {
      dispatch(removeEvent(event._id || event.id));
      navigate('/events');
    }
  };

  const daysRemaining = Math.ceil(
    (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Top Navigation */}
      <div className="bg-white border-b border-border py-4 px-4">
        <div className="section-container flex items-center justify-between">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <Button
            size="xs"
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleDelete}
          >
            Delete Plan
          </Button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative bg-primary text-white py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={event.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="section-container relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs">
              {event.eventType}
            </span>
            <Badge variant="warning" size="xs">
              {event.status}
            </Badge>
            <span className="text-xs text-accent flex items-center gap-1 font-medium ml-2">
              <Clock className="w-3.5 h-3.5" />
              {daysRemaining > 0 ? `${daysRemaining} Days Countdown` : 'Celebration Completed'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
            {event.name}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{event.city || 'Location to be selected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <span>{event.guestCount} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span>Budget: {event.estimatedBudget ? formatCurrency(event.estimatedBudget) : 'Flexible'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="section-container pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Checklist & Details */}
          <div className="lg:col-span-2 space-y-8">
            <EventChecklist event={event} />

            {/* Event Notes Card */}
            {event.notes && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
                <h3 className="font-serif font-bold text-lg text-text mb-2">
                  Special Notes & Host Preferences
                </h3>
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                  {event.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right Col: Venue & Vendor Linkage */}
          <div className="space-y-6">
            {/* Linked Venue Card */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <h4 className="font-serif font-bold text-base text-text flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" />
                  Linked Venue
                </h4>
                <Link to="/venues" className="text-xs text-primary font-semibold hover:underline">
                  Browse Venues
                </Link>
              </div>

              {event.venue ? (
                <div className="space-y-3">
                  <div className="h-32 rounded-xl overflow-hidden bg-neutral-100">
                    <img
                      src={event.venue.image || event.venue.images?.[0]?.url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'}
                      alt={event.venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold text-text text-sm">{event.venue.name}</h5>
                    <p className="text-xs text-text-muted">{event.venue.city}</p>
                    <p className="text-xs font-bold text-primary mt-1">
                      Starting {formatCurrency(event.venue.startingPrice || 150000)}
                    </p>
                  </div>
                  <Link
                    to={`/venues/${event.venue._id || event.venue.id || '1'}`}
                    className="block text-center w-full py-2 bg-primary-50 text-primary rounded-lg text-xs font-semibold hover:bg-primary-100 transition-colors"
                  >
                    View Venue Specs
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-text-muted mb-3">No venue linked to this celebration yet.</p>
                  <Link to="/venues">
                    <Button size="xs" variant="primary">
                      Explore & Link Venue
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-primary-50/70 border border-primary-100 rounded-2xl p-5">
              <h4 className="font-serif font-bold text-sm text-text mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Next Steps for Your Celebration
              </h4>
              <ul className="text-xs text-text-muted space-y-2 mb-4">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Explore top-rated caterers and floral decorators in {event.city}.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Use the Budget Planner to allocate costs across categories.</span>
                </li>
              </ul>
              <Link to="/vendors" className="block">
                <Button size="sm" variant="outline" className="w-full justify-center bg-white">
                  Find Celebration Vendors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
