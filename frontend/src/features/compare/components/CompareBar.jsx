/**
 * Floating Compare Bar Component
 *
 * Appears fixed at the bottom of the screen when any venue or vendor is shortlisted for comparison.
 * Allows quick review, thumbnail previews, direct removal, and instant navigation to the Compare page.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCompareVenues,
  selectCompareVendors,
  removeCompareVenue,
  removeCompareVendor,
  clearCompareVenues,
  clearCompareVendors,
} from '../compareSlice';
import { sampleVenues } from '@/features/venues/venuesData';
import { sampleVendors } from '@/features/vendors/vendorsData';
import { ArrowRight, X, Scale, Layers } from 'lucide-react';
import Button from '@/components/common/Button';

export const CompareBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const venueIds = useSelector(selectCompareVenues);
  const vendorIds = useSelector(selectCompareVendors);

  // Hide compare bar on the actual compare page
  if (location.pathname === '/compare') return null;

  const totalCompareCount = venueIds.length + vendorIds.length;
  if (totalCompareCount === 0) return null;

  // Resolve objects
  const comparedVenues = venueIds.map((id) => {
    return sampleVenues.find((v) => String(v.id) === id) || { id, name: 'Venue #' + id };
  });

  const comparedVendors = vendorIds.map((id) => {
    return sampleVendors.find((v) => String(v.id) === id) || { id, businessName: 'Vendor #' + id };
  });

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slide-up">
      <div className="bg-text text-white rounded-2xl shadow-dropdown border border-neutral-700/60 p-3 sm:p-4 backdrop-blur-md flex items-center justify-between gap-4">
        {/* Left Section: Count & Icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-sm">
              <span>Compare Items</span>
              <span className="bg-primary/30 text-accent text-xs px-2 py-0.5 rounded-full font-bold">
                {venueIds.length > 0 ? `${venueIds.length} Venues` : ''}
                {venueIds.length > 0 && vendorIds.length > 0 ? ', ' : ''}
                {vendorIds.length > 0 ? `${vendorIds.length} Vendors` : ''}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Side-by-side pricing, capacity & amenities
            </p>
          </div>
        </div>

        {/* Center: Selected Thumbnails */}
        <div className="hidden md:flex items-center gap-2 overflow-hidden">
          {comparedVenues.map((v) => (
            <div
              key={v.id}
              className="relative group w-10 h-10 rounded-lg overflow-hidden border border-neutral-600 shrink-0 bg-neutral-800"
              title={v.name}
            >
              <img
                src={v.images?.[0]?.url || v.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=150&q=80'}
                alt={v.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => dispatch(removeCompareVenue(v.id))}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {comparedVendors.map((vd) => (
            <div
              key={vd.id}
              className="relative group w-10 h-10 rounded-lg overflow-hidden border border-neutral-600 shrink-0 bg-neutral-800"
              title={vd.businessName || vd.name}
            >
              <img
                src={vd.avatar || vd.image || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=150&q=80'}
                alt={vd.businessName || vd.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => dispatch(removeCompareVendor(vd.id))}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              dispatch(clearCompareVenues());
              dispatch(clearCompareVendors());
            }}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 transition-colors"
          >
            Clear
          </button>
          <Link to="/compare">
            <Button
              size="sm"
              variant="primary"
              className="shadow-primary-sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Compare Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
