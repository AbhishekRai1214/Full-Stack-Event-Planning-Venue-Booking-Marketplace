/**
 * CreateEventModal Component
 *
 * Modal form allowing users to create a new celebration plan.
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewEvent } from '../eventsSlice';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { Calendar, Users, MapPin, Sparkles, DollarSign } from 'lucide-react';

export const CreateEventModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    eventType: 'wedding',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    city: 'Mumbai',
    guestCount: 150,
    estimatedBudget: 500000,
    notes: '',
  });

  const dispatch = useDispatch();

  const eventTypes = [
    { label: 'Wedding', value: 'wedding' },
    { label: 'Birthday Party', value: 'birthday' },
    { label: 'Engagement', value: 'engagement' },
    { label: 'Baby Shower', value: 'baby_shower' },
    { label: 'Corporate Event', value: 'corporate' },
    { label: 'Anniversary', value: 'anniversary' },
    { label: 'Farewell Party', value: 'farewell' },
    { label: 'Religious Event', value: 'religious' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createNewEvent({
        ...formData,
        guestCount: Number(formData.guestCount),
        estimatedBudget: Number(formData.estimatedBudget),
      })
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event Plan" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Maya & Rohan Grand Sangeet"
            className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              Event Category
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              City / Destination
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Udaipur"
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              Expected Guests
            </label>
            <input
              type="number"
              name="guestCount"
              min="1"
              value={formData.guestCount}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              Budget (₹)
            </label>
            <input
              type="number"
              name="estimatedBudget"
              min="0"
              step="10000"
              value={formData.estimatedBudget}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
            Planning Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key preferences, theme colors, special requirements..."
            className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="pt-3 border-t border-border flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={<Sparkles className="w-4 h-4" />}>
            Create Event Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventModal;
