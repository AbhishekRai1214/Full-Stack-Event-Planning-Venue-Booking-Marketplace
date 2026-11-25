/**
 * EventCard Component
 *
 * Visual card displaying event overview, date countdown, guest count,
 * progress bar of checklist tasks, and quick action buttons.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, CheckSquare, ArrowRight, Clock } from 'lucide-react';
import Badge from '@/components/common/Badge';
import { formatCurrency, formatDate } from '@/utils';

export const EventCard = ({ event, onDelete }) => {
  const eventId = event._id || event.id;
  const checklist = event.checklist || [];
  const completedTasks = checklist.filter((t) => t.isCompleted).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0;

  // Calculate days remaining
  const eventDate = new Date(event.date);
  const today = new Date();
  const diffTime = eventDate - today;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" size="xs">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="primary" size="xs">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger" size="xs">Cancelled</Badge>;
      default:
        return <Badge variant="warning" size="xs">Planning Mode</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Cover Image & Badges */}
      <div className="relative h-44 overflow-hidden bg-neutral-100">
        <img
          src={event.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge(event.status)}
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/90 text-text backdrop-blur-xs">
            {event.eventType}
          </span>
        </div>

        {/* Days Left Chip */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-xs text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Event Today / Concluded'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-text group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {event.name}
          </h3>

          <div className="space-y-1.5 text-xs text-text-muted mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{event.city || 'City to be chosen'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{event.guestCount || 100} Estimated Guests</span>
            </div>
          </div>

          {/* Checklist Progress Bar */}
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-text flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-primary" />
                Planning Progress
              </span>
              <span className="font-semibold text-primary">
                {completedTasks}/{checklist.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Footers */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Budget</p>
            <p className="text-sm font-bold text-text">
              {event.estimatedBudget ? formatCurrency(event.estimatedBudget) : 'Flexible'}
            </p>
          </div>

          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100"
          >
            <span>Manage Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
