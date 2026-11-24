import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Camera,
  UtensilsCrossed,
  Sparkles,
  Music,
  Smile,
  Car,
  Palette,
  Tent,
  Radio,
  Flame,
  Flower2,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/homeData';

const iconMap = {
  Building2,
  Camera,
  UtensilsCrossed,
  Sparkles,
  Music,
  Smile,
  Car,
  Palette,
  Tent,
  Radio,
  Flame,
  Flower2,
  Mail,
};

export const EverythingInOnePlace = () => {
  return (
    <section className="section-padding bg-background-secondary border-y border-border">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary text-xs font-semibold uppercase tracking-wider block mb-1.5">
            Full-Spectrum Services
          </span>
          <h2 className="text-display-sm md:text-display-md font-serif font-bold text-text">
            Everything in One Place
          </h2>
          <p className="text-text-muted text-sm md:text-base mt-2">
            From majestic venue bookings to award-winning photographers, decorators, caterers, and priests.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {SERVICE_CATEGORIES.map((item) => {
            const IconComponent = iconMap[item.icon] || Sparkles;
            const isVenue = item.id === 'venues';
            const targetUrl = isVenue ? '/venues' : `/vendors?category=${item.id}`;

            return (
              <Link
                key={item.id}
                to={targetUrl}
                className="group card p-4 flex flex-col items-center text-center bg-white border border-border hover:border-primary hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:shadow-primary-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-text group-hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h4>
                <span className="text-[11px] text-text-muted mt-0.5">
                  {item.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 md:p-8 rounded-card-lg bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif font-bold text-xl md:text-2xl">
              Are you an Event Vendor or Venue Owner?
            </h3>
            <p className="text-neutral-300 text-sm max-w-xl">
              List your business on VenueAura to receive verified client inquiries, manage event bookings, and grow your revenue.
            </p>
          </div>
          <Link to="/register?role=vendor" className="shrink-0">
            <span className="btn-primary bg-primary hover:bg-primary-600 text-white">
              List Your Service Free
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EverythingInOnePlace;

