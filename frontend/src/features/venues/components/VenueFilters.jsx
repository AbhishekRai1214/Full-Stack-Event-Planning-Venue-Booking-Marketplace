import React from 'react';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Filter,
  RotateCcw,
  Star,
  Check,
} from 'lucide-react';
import Button from '@/components/common/Button';

export const VenueFilters = ({ filters, onChange, onReset }) => {
  const cities = [
    { value: '', label: 'All Cities' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi NCR', label: 'Delhi NCR' },
    { value: 'Jaipur', label: 'Jaipur' },
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Udaipur', label: 'Udaipur' },
    { value: 'Pune', label: 'Pune' },
  ];

  const eventTypes = [
    { value: '', label: 'All Celebrations' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'baby_shower', label: 'Baby Shower' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'farewell', label: 'Farewell Party' },
    { value: 'anniversary', label: 'Anniversary' },
  ];

  const venueTypes = [
    { value: '', label: 'All Types' },
    { value: 'banquet', label: 'Banquet Hall' },
    { value: 'farmhouse', label: 'Farmhouse / Palace' },
    { value: 'rooftop', label: 'Rooftop Lawn' },
    { value: 'outdoor', label: 'Outdoor Lawn / Resort' },
    { value: 'indoor', label: 'Indoor Hall' },
  ];

  const priceRanges = [
    { label: 'Any Budget', min: '', max: '' },
    { label: 'Under ₹1.5 Lakh', min: '', max: '150000' },
    { label: '₹1.5L - ₹3 Lakh', min: '150000', max: '300000' },
    { label: '₹3L - ₹5 Lakh', min: '300000', max: '500000' },
    { label: '₹5 Lakh & Above', min: '500000', max: '' },
  ];

  const capacityOptions = [
    { label: 'Any Capacity', min: '' },
    { label: 'Up to 200 Guests', min: '200' },
    { label: '500+ Guests', min: '500' },
    { label: '1,000+ Guests', min: '1000' },
  ];

  const ratings = [
    { value: '', label: 'Any Rating' },
    { value: '4.8', label: '4.8 & Above' },
    { value: '4.5', label: '4.5 & Above' },
    { value: '4.0', label: '4.0 & Above' },
  ];

  const handlePriceSelect = (min, max) => {
    onChange({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="card p-5 bg-white border border-border space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-serif font-bold text-base text-text">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-text-muted hover:text-primary flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. City / Location */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          City / Location
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => onChange({ city: e.target.value })}
          className="input-field text-xs py-2 bg-background-secondary"
        >
          {cities.map((c) => (
            <option key={c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Event Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          Event Type
        </label>
        <select
          value={filters.eventType || ''}
          onChange={(e) => onChange({ eventType: e.target.value })}
          className="input-field text-xs py-2 bg-background-secondary"
        >
          {eventTypes.map((et) => (
            <option key={et.label} value={et.value}>
              {et.label}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Venue Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          Space Style
        </label>
        <div className="space-y-1.5">
          {venueTypes.map((vt) => {
            const isSelected = (filters.venueType || '') === vt.value;
            return (
              <button
                key={vt.label}
                type="button"
                onClick={() => onChange({ venueType: vt.value })}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-muted hover:bg-neutral-100 hover:text-text'
                }`}
              >
                <span>{vt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          Price Range
        </label>
        <div className="space-y-1.5">
          {priceRanges.map((pr) => {
            const isSelected =
              (filters.minPrice || '') === pr.min && (filters.maxPrice || '') === pr.max;
            return (
              <button
                key={pr.label}
                type="button"
                onClick={() => handlePriceSelect(pr.min, pr.max)}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-muted hover:bg-neutral-100 hover:text-text'
                }`}
              >
                <span>{pr.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Guest Capacity */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          Guest Capacity
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {capacityOptions.map((cap) => {
            const isSelected = (filters.minCapacity || '') === cap.min;
            return (
              <button
                key={cap.label}
                type="button"
                onClick={() => onChange({ minCapacity: cap.min })}
                className={`text-xs px-2 py-1.5 rounded-button text-center border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                    : 'border-border text-text-muted hover:border-neutral-400'
                }`}
              >
                {cap.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Rating */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          Minimum Rating
        </label>
        <select
          value={filters.rating || ''}
          onChange={(e) => onChange({ rating: e.target.value })}
          className="input-field text-xs py-2 bg-background-secondary"
        >
          {ratings.map((r) => (
            <option key={r.label} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VenueFilters;

