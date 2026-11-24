import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

export const VendorFilters = ({ filters, onChange, onReset }) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'photographer', label: 'Photographers & Films' },
    { value: 'caterer', label: 'Catering & Banquets' },
    { value: 'decorator', label: 'Decorators & Mandap' },
    { value: 'dj', label: 'DJ & Sound Audio' },
    { value: 'makeup', label: 'Makeup & Hair Artists' },
    { value: 'band', label: 'Live Bands & Musicians' },
    { value: 'mehndi', label: 'Mehendi Artists' },
    { value: 'florist', label: 'Florists' },
  ];

  const cities = [
    { value: '', label: 'All Cities' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi NCR', label: 'Delhi NCR' },
    { value: 'Jaipur', label: 'Jaipur' },
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Hyderabad', label: 'Hyderabad' },
  ];

  const experienceTiers = [
    { value: '', label: 'Any Experience' },
    { value: '5', label: '5+ Years in Industry' },
    { value: '8', label: '8+ Years in Industry' },
    { value: '10', label: '10+ Years in Industry' },
    { value: '15', label: '15+ Years (Veteran)' },
  ];

  const priceRanges = [
    { label: 'Any Budget', min: '', max: '' },
    { label: 'Under ₹50,000', min: '', max: '50000' },
    { label: '₹50,000 - ₹1,00,000', min: '50000', max: '100000' },
    { label: '₹1,00,000 - ₹2,00,000', min: '100000', max: '200000' },
    { label: '₹2,00,000 & Above', min: '200000', max: '' },
  ];

  return (
    <div className="card p-5 bg-white border border-border space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-serif font-bold text-base text-text">Vendor Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-text-muted hover:text-primary flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          Service Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => onChange({ category: e.target.value })}
          className="input-field text-xs py-2 bg-background-secondary"
        >
          {categories.map((c) => (
            <option key={c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. City */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          City / Hub
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

      {/* 3. Experience */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text uppercase tracking-wider block">
          Experience Level
        </label>
        <select
          value={filters.minExperience || ''}
          onChange={(e) => onChange({ minExperience: e.target.value })}
          className="input-field text-xs py-2 bg-background-secondary"
        >
          {experienceTiers.map((exp) => (
            <option key={exp.label} value={exp.value}>
              {exp.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Budget Range */}
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
                onClick={() => onChange({ minPrice: pr.min, maxPrice: pr.max })}
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
    </div>
  );
};

export default VendorFilters;
