import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import VendorCard from '@/components/cards/VendorCard';
import { TOP_VENDORS } from '../data/homeData';

export const TopRatedVendorsSection = () => {
  return (
    <section className="section-padding bg-background-secondary border-t border-border">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Industry Professionals</span>
            </div>
            <h2 className="text-display-sm md:text-display-md font-serif font-bold text-text">
              Top Rated Vendors
            </h2>
            <p className="text-text-muted text-sm md:text-base mt-1">
              Acclaimed event specialists ready to make your dream celebration unforgettable.
            </p>
          </div>
          <Link
            to="/vendors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
          >
            <span>Discover all vendors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOP_VENDORS.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedVendorsSection;

