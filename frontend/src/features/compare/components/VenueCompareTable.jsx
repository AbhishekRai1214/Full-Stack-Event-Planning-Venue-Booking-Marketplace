/**
 * VenueCompareTable Component
 *
 * Side-by-side comparison matrix for up to 4 shortlisted venues:
 * - Cover image, name, location, and quick remove buttons
 * - Pricing comparisons: starting price, per plate veg & non-veg
 * - Guest capacity: min to max
 * - Venue Type & Event compatibility tags
 * - Key facilities / amenities matrix (Check vs Cross comparison)
 * - Ratings & review metrics
 * - Direct "Book Venue" action links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeCompareVenue, clearCompareVenues } from '../compareSlice';
import { Check, X, MapPin, Users, IndianRupee, Sparkles, Building, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Rating from '@/components/common/Rating';
import { formatCurrency } from '@/utils';

const COMMON_FACILITIES = [
  'Valet Parking',
  'Air Conditioning',
  'Bridal Dressing Room',
  'In-house Catering',
  'Power Backup',
  'Alcohol Permitted',
  'DJ Permitted',
  'Luxury Guest Rooms',
];

export const VenueCompareTable = ({ venues = [] }) => {
  const dispatch = useDispatch();

  if (venues.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto shadow-card">
        <Building className="w-16 h-16 text-primary/30 mx-auto mb-4" />
        <h3 className="font-serif font-bold text-2xl text-text mb-2">No Venues Selected</h3>
        <p className="text-sm text-text-muted mb-6">
          Browse our luxury banquet halls, heritage palaces, and open lawns to add up to 4 venues for side-by-side comparison.
        </p>
        <Link to="/venues">
          <Button variant="primary" size="md">
            Browse Venues
          </Button>
        </Link>
      </div>
    );
  }

  // Helper to check if a facility is mentioned in venue.facilities array
  const hasFacility = (venue, facilityKeyword) => {
    if (!venue.facilities) return false;
    const lower = facilityKeyword.toLowerCase();
    return venue.facilities.some((f) => f.toLowerCase().includes(lower));
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-xl text-text">
            Side-by-Side Venue Comparison
          </h2>
          <p className="text-xs text-text-muted">
            Comparing {venues.length} celebration {venues.length === 1 ? 'venue' : 'venues'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(clearCompareVenues())}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Venues</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[650px]">
          <tbody>
            {/* 1. Venue Profiles Row */}
            <tr className="bg-neutral-50/60 border-b border-border">
              <td className="p-4 w-44 font-semibold text-text-muted uppercase text-[10px] tracking-wider align-top">
                Venue
              </td>
              {venues.map((venue) => {
                const img = venue.images?.[0]?.url || venue.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80';
                return (
                  <td key={venue.id} className="p-4 w-64 align-top border-l border-border">
                    <div className="space-y-3">
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-neutral-100">
                        <img
                          src={img}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => dispatch(removeCompareVenue(venue.id))}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-sm text-text line-clamp-1">
                          {venue.name}
                        </h4>
                        <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                          <span>{venue.location?.city || venue.city}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Rating value={venue.rating || 4.8} count={venue.reviewsCount || 95} size="xs" />
                      </div>

                      <Link to={`/venues/${venue.id}`} className="block">
                        <Button size="xs" variant="primary" className="w-full justify-center">
                          View Full Details
                        </Button>
                      </Link>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 2. Venue Type */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Venue Type
              </td>
              {venues.map((venue) => (
                <td key={venue.id} className="p-3.5 border-l border-border font-medium capitalize text-text">
                  <Badge variant="primary" size="xs">
                    {venue.venueType || 'Banquet Hall'}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* 3. Starting Price */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Starting Rental
              </td>
              {venues.map((venue) => {
                const price = venue.pricing?.startingPrice || venue.startingPrice || 150000;
                return (
                  <td key={venue.id} className="p-3.5 border-l border-border font-bold text-sm text-primary">
                    {formatCurrency(price)}
                  </td>
                );
              })}
            </tr>

            {/* 4. Price Per Plate */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Food / Plate
              </td>
              {venues.map((venue) => {
                const perPlate = venue.pricing?.pricePerPlate || venue.pricePerPlate || 1800;
                return (
                  <td key={venue.id} className="p-3.5 border-l border-border font-semibold text-text">
                    ₹{perPlate} <span className="text-[10px] text-text-muted font-normal">/ person</span>
                  </td>
                );
              })}
            </tr>

            {/* 5. Guest Capacity Range */}
            <tr className="border-b border-border">
              <td className="p-3.5 font-semibold text-text-muted uppercase text-[10px] tracking-wider bg-neutral-50/40">
                Guest Capacity
              </td>
              {venues.map((venue) => {
                const cap = venue.capacity || { min: 100, max: 1000 };
                return (
                  <td key={venue.id} className="p-3.5 border-l border-border text-text font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{cap.min} – {cap.max} Guests</span>
                  </td>
                );
              })}
            </tr>

            {/* 6. Facilities & Amenities Comparison */}
            <tr className="bg-primary-50/30 border-b border-border">
              <td colSpan={venues.length + 1} className="py-2.5 px-4 font-serif font-bold text-xs text-primary">
                Key Amenities & Permissions Matrix
              </td>
            </tr>

            {COMMON_FACILITIES.map((facility) => (
              <tr key={facility} className="border-b border-border hover:bg-neutral-50/50 transition-colors">
                <td className="p-3 font-medium text-text bg-neutral-50/40">
                  {facility}
                </td>
                {venues.map((venue) => {
                  const available = hasFacility(venue, facility);
                  return (
                    <td key={venue.id} className="p-3 border-l border-border text-center">
                      {available ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="hidden sm:inline">Included</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-neutral-400 text-xs">
                          <X className="w-4 h-4 text-neutral-300" />
                          <span className="hidden sm:inline">—</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenueCompareTable;
