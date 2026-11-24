import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EVENT_CATEGORIES } from '../data/homeData';

export const BrowseByEvent = () => {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-wider block mb-1.5">
              Celebrations
            </span>
            <h2 className="text-display-sm md:text-display-md font-serif font-bold text-text">
              Browse by Event
            </h2>
            <p className="text-text-muted text-sm md:text-base mt-1">
              Select your celebration style to explore venues designed specifically for your occasion.
            </p>
          </div>
          <Link
            to="/venues"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
          >
            <span>View all event types</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Event Categories Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {EVENT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/venues?eventType=${cat.id}`}
              className="group relative aspect-4/3 sm:aspect-square rounded-card overflow-hidden shadow-card border border-border"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity group-hover:from-black/95" />

              {/* Text Info */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col justify-end text-white">
                <span className="text-[11px] font-medium text-primary-300 uppercase tracking-wider mb-1">
                  {cat.count}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl leading-snug group-hover:text-primary-200 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-neutral-300 text-xs hidden sm:line-clamp-1 mt-1 opacity-90 font-light">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByEvent;
