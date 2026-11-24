import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, CheckCircle2, IndianRupee } from 'lucide-react';
import Badge from '@/components/common/Badge';
import Rating from '@/components/common/Rating';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils';

export const VenueCard = ({
  venue = {},
  isSaved = false,
  onSaveToggle,
}) => {
  const {
    id = '1',
    name = 'The Grand Heritage Palace',
    city = 'Mumbai',
    image = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    capacity = { min: 200, max: 1200 },
    startingPrice = 150000,
    pricePerPlate = 1800,
    rating = 4.8,
    reviewsCount = 124,
    isVerified = true,
    venueType = 'Banquet Hall',
  } = venue;

  return (
    <div className="group card overflow-hidden border border-border flex flex-col hover:-translate-y-1 transition-all duration-300">
      {/* Image Thumbnail & Overlays */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur-xs font-semibold shadow-xs">
            {venueType}
          </Badge>
          {isVerified && (
            <Badge variant="success" size="sm" className="bg-emerald-500 text-white border-none shadow-xs" icon={<CheckCircle2 className="w-3 h-3" />}>
              Verified
            </Badge>
          )}
        </div>

        {/* Save/Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onSaveToggle?.(id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-xs"
          aria-label="Save venue"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs flex items-center">
          <Rating value={rating} count={reviewsCount} size="xs" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{city}</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-text line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-text-muted mt-2">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              {capacity.min || 100} - {capacity.max || 1000} Guests
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-muted block">
              Starting from
            </span>
            <span className="font-bold text-base text-primary">
              {formatCurrency(startingPrice, true)}
            </span>
            {pricePerPlate && (
              <span className="text-[11px] text-text-muted block">
                ₹{pricePerPlate} / plate
              </span>
            )}
          </div>
          <Link to={`/venues/${id}`}>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
