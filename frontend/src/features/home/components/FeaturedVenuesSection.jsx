import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import VenueCard from '@/components/cards/VenueCard';
import { FEATURED_VENUES } from '../data/homeData';

export const FeaturedVenuesSection = () => {
  const [savedVenues, setSavedVenues] = useState([]);

  const handleToggleSave = (id) => {
    setSavedVenues((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Spaces</span>
            </div>
            <h2 className="text-display-sm md:text-display-md font-serif font-bold text-text">
              Featured Venues
            </h2>
            <p className="text-text-muted text-sm md:text-base mt-1">
              Top-rated destination palaces, luxury lawns, and banquet spaces verified by our team.
            </p>
          </div>
          <Link
            to="/venues"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
          >
            <span>Explore all venues</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURED_VENUES.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              isSaved={savedVenues.includes(venue.id)}
              onSaveToggle={handleToggleSave}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenuesSection;

