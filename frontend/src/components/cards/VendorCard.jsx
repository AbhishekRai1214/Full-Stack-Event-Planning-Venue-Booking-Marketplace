import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Briefcase, Award, CheckCircle2, Scale } from 'lucide-react';
import Badge from '@/components/common/Badge';
import Rating from '@/components/common/Rating';
import Button from '@/components/common/Button';
import { toggleCompareVendor, selectCompareVendors } from '@/features/compare/compareSlice';
import { formatCurrency } from '@/utils';

export const VendorCard = ({ vendor = {} }) => {
  const dispatch = useDispatch();
  const compareVendorIds = useSelector(selectCompareVendors);

  const {
    id = '1',
    name = 'Studio Lumière Photography',
    category = 'Photographer',
    city = 'Delhi NCR',
    image = 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
    experience = '8+ Years Exp.',
    startingPrice = 45000,
    rating = 4.9,
    reviewsCount = 88,
    isVerified = true,
  } = vendor;

  const isCompared = compareVendorIds.includes(String(id));

  return (
    <div className="group card overflow-hidden border border-border p-4 flex gap-4 hover:shadow-card-hover transition-all duration-300">
      {/* Vendor Profile Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {isVerified && (
          <span className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-0.5" title="Verified Vendor">
            <CheckCircle2 className="w-3.5 h-3.5 fill-primary text-white" />
          </span>
        )}

        {/* Compare Toggle Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleCompareVendor(id));
          }}
          className={`absolute top-1 right-1 w-6 h-6 rounded-full backdrop-blur-xs flex items-center justify-center transition-all ${
            isCompared
              ? 'bg-primary text-white scale-105 shadow-xs'
              : 'bg-white/80 text-neutral-600 hover:text-primary hover:bg-white'
          }`}
          title={isCompared ? 'Remove from compare' : 'Add to compare'}
        >
          <Scale className="w-3 h-3" />
        </button>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="primary" size="sm">
              {category}
            </Badge>
            <Rating value={rating} count={reviewsCount} size="xs" />
          </div>
          <h4 className="font-serif font-bold text-base text-text mt-1.5 group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h4>
          <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              {city}
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3 text-neutral-400" />
              {experience}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between mt-2 border-t border-border">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-text-muted block">
              Starts at
            </span>
            <span className="font-bold text-sm text-primary">
              {formatCurrency(startingPrice)}
            </span>
          </div>
          <Link to={`/vendors/${id}`}>
            <Button variant="outline" size="sm" className="text-xs py-1.5 px-3">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;

