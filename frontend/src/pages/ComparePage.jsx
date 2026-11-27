/**
 * ComparePage Component
 *
 * Side-by-side venue and vendor comparison dashboard:
 * - Toggle tabs between Venues & Vendors
 * - Shortlist management and counter
 * - Rich comparison matrices (Pricing, Capacity, Facilities, Ratings)
 * - Empty states with quick-navigation recommendations
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCompareVenues,
  selectCompareVendors,
  selectCompareTab,
  setCompareTab,
} from '@/features/compare/compareSlice';
import { sampleVenues } from '@/features/venues/venuesData';
import { sampleVendors } from '@/features/vendors/vendorsData';
import VenueCompareTable from '@/features/compare/components/VenueCompareTable';
import VendorCompareTable from '@/features/compare/components/VendorCompareTable';
import { Scale, Building, Camera, Sparkles } from 'lucide-react';

export const ComparePage = () => {
  const dispatch = useDispatch();

  const venueIds = useSelector(selectCompareVenues);
  const vendorIds = useSelector(selectCompareVendors);
  const activeTab = useSelector(selectCompareTab);

  // Resolve venues and vendors from IDs
  const comparedVenues = venueIds.map((id) => {
    return sampleVenues.find((v) => String(v.id) === id) || { id, name: 'Venue #' + id };
  });

  const comparedVendors = vendorIds.map((id) => {
    return sampleVendors.find((v) => String(v.id) === id) || { id, businessName: 'Vendor #' + id };
  });

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Header Banner */}
      <div className="bg-primary text-white py-12 px-4 border-b border-primary-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-semibold tracking-wider uppercase mb-2">
                <Scale className="w-4 h-4" />
                <span>Side-by-Side Evaluation</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Compare Venues & Vendors
              </h1>
              <p className="mt-1 text-sm text-white/80 max-w-xl">
                Compare pricing tiers, guest capacities, amenities, and vendor portfolios side-by-side to make the ideal choice for your celebration.
              </p>
            </div>

            {/* Tab Switcher Pills */}
            <div className="flex items-center gap-2 bg-primary-dark/60 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
              <button
                type="button"
                onClick={() => dispatch(setCompareTab('venues'))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'venues'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Venues ({venueIds.length}/4)</span>
              </button>

              <button
                type="button"
                onClick={() => dispatch(setCompareTab('vendors'))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'vendors'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Vendors ({vendorIds.length}/4)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Tables Workspace */}
      <div className="section-container pt-8">
        {activeTab === 'venues' ? (
          <VenueCompareTable venues={comparedVenues} />
        ) : (
          <VendorCompareTable vendors={comparedVendors} />
        )}
      </div>
    </div>
  );
};

export default ComparePage;
