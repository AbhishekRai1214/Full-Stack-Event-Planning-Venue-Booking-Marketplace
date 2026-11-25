/**
 * Events Page
 *
 * Customer event management dashboard listing all events,
 * countdown badges, stats summary, and quick "New Event" creation.
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents,
  selectAllEvents,
  selectEventsLoading,
  selectEventsError,
} from '@/features/events/eventsSlice';
import EventCard from '@/features/events/components/EventCard';
import CreateEventModal from '@/features/events/components/CreateEventModal';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { Sparkles, Calendar, Plus, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const events = useSelector(selectAllEvents);
  const isLoading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Aggregate stats
  const totalEvents = events.length;
  const totalGuests = events.reduce((acc, curr) => acc + (curr.guestCount || 0), 0);
  const activePlanning = events.filter((e) => e.status === 'planning' || e.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-primary text-white py-12 px-4 border-b border-primary-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Event Management Central</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                My Celebrations & Events
              </h1>
              <p className="mt-1 text-sm text-white/80 max-w-xl">
                Track venue availability, coordinate verified vendors, manage checklists, and monitor budget allocations all in one place.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white text-white hover:text-primary border-white/20 self-start md:self-auto"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Plan New Celebration
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-white/70">Total Events</p>
              <p className="text-2xl font-bold text-accent mt-0.5">{totalEvents}</p>
            </div>
            <div>
              <p className="text-xs text-white/70">Active In-Planning</p>
              <p className="text-2xl font-bold text-white mt-0.5">{activePlanning}</p>
            </div>
            <div>
              <p className="text-xs text-white/70">Total Guests Expected</p>
              <p className="text-2xl font-bold text-white mt-0.5">{totalGuests.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Events Grid */}
      <div className="section-container pt-10">
        {isLoading && events.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" text="Loading your celebration plans..." />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto shadow-card">
            <div className="w-16 h-16 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-text mb-2">No Events Created Yet</h3>
            <p className="text-sm text-text-muted mb-6">
              Start planning your wedding, birthday party, engagement or celebration with interactive checklists and venue linking.
            </p>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EventsPage;
