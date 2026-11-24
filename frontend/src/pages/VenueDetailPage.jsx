import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVenueDetail, toggleSaveVenue } from '@/features/venues/venuesSlice';
import VenueGallery from '@/features/venues/components/VenueGallery';
import VenueFacilities from '@/features/venues/components/VenueFacilities';
import VenueBookingCard from '@/features/venues/components/VenueBookingCard';
import Rating from '@/components/common/Rating';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import {
  MapPin,
  Users,
  CheckCircle2,
  Heart,
  Share2,
  Calendar,
  Building2,
  ArrowLeft,
  Star,
  Check,
} from 'lucide-react';
import { formatCurrency, formatEventType } from '@/utils';

export const VenueDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedVenue, savedVenueIds, loading, error } = useSelector(
    (state) => state.venues
  );

  const isSaved = selectedVenue && savedVenueIds.includes(selectedVenue.id);

  useEffect(() => {
    if (id) {
      dispatch(fetchVenueDetail(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  const handleSaveToggle = () => {
    if (selectedVenue) {
      dispatch(toggleSaveVenue(selectedVenue.id));
    }
  };

  if (loading && !selectedVenue) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Spinner size="lg" />
        <p className="text-text-muted text-sm mt-3">Loading venue details...</p>
      </div>
    );
  }

  if (error || !selectedVenue) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-text mb-2">Venue Not Found</h2>
        <p className="text-text-muted text-sm mb-6">
          The venue you are looking for might have been moved or is currently unavailable.
        </p>
        <Link to="/venues">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Venues Directory
          </Button>
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    location,
    capacity,
    pricing,
    facilities,
    images,
    isVerified,
    ratings,
    eventTypes,
    venueType,
  } = selectedVenue;

  return (
    <div className="bg-background-secondary min-h-screen py-8 lg:py-12">
      <div className="section-container space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/venues" className="hover:text-primary transition-colors">Venues</Link>
            <span>/</span>
            <span className="text-text font-medium truncate max-w-xs">{name}</span>
          </div>

          <Link to="/venues" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to search</span>
          </Link>
        </div>

        {/* Title Header Bar */}
        <div className="card p-6 bg-white border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">
                {venueType}
              </Badge>
              {isVerified && (
                <Badge
                  variant="success"
                  size="sm"
                  icon={<CheckCircle2 className="w-3 h-3" />}
                >
                  Verified Venue
                </Badge>
              )}
              {eventTypes?.map((et) => (
                <Badge key={et} variant="outline" size="sm">
                  {formatEventType(et)}
                </Badge>
              ))}
            </div>

            <h1 className="text-display-sm md:text-display-md font-serif font-bold text-text leading-tight">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {location.address}, {location.city}, {location.state}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                {capacity.min} - {capacity.max} Guests
              </span>
              <Rating value={ratings.average} count={ratings.count} size="sm" />
            </div>
          </div>

          {/* Social Share & Wishlist Save */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleSaveToggle}
              className="btn-secondary px-4 py-2.5 text-xs"
            >
              <Heart
                className={`w-4 h-4 ${
                  isSaved ? 'fill-rose-500 text-rose-500' : 'text-primary'
                }`}
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Venue link copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-button border border-border text-text hover:bg-neutral-100 transition-colors"
              title="Share Venue"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Showcase */}
        <VenueGallery images={images} />

        {/* 2-Column Layout: Details on Left, Booking Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Description, Specs, Facilities, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Description */}
            <div className="card p-6 bg-white border border-border space-y-3">
              <h3 className="font-serif font-bold text-xl text-text">About This Venue</h3>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card p-4 bg-white border border-border text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted block">
                  Capacity
                </span>
                <span className="font-bold text-sm text-text block">
                  {capacity.min} - {capacity.max}
                </span>
                <span className="text-[11px] text-text-muted">Guests</span>
              </div>
              <div className="card p-4 bg-white border border-border text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted block">
                  Starting Price
                </span>
                <span className="font-bold text-sm text-primary block">
                  {formatCurrency(pricing.startingPrice, true)}
                </span>
                <span className="text-[11px] text-text-muted">per day</span>
              </div>
              <div className="card p-4 bg-white border border-border text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted block">
                  Catering
                </span>
                <span className="font-bold text-sm text-text block">
                  {pricing.pricePerPlate ? `₹${pricing.pricePerPlate}` : 'Custom'}
                </span>
                <span className="text-[11px] text-text-muted">per plate</span>
              </div>
              <div className="card p-4 bg-white border border-border text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted block">
                  Space Type
                </span>
                <span className="font-bold text-sm text-text block capitalize">
                  {venueType}
                </span>
                <span className="text-[11px] text-text-muted">Style</span>
              </div>
            </div>

            {/* Facilities & Amenities */}
            <div className="card p-6 bg-white border border-border">
              <VenueFacilities facilities={facilities} />
            </div>

            {/* Verified Reviews Overview */}
            <div className="card p-6 bg-white border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-serif font-bold text-xl text-text">
                  Verified Reviews & Ratings
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-text">{ratings.average}</span>
                  <Rating value={ratings.average} count={ratings.count} size="sm" showValue={false} />
                </div>
              </div>

              {/* Sample Verified Reviews */}
              <div className="space-y-4">
                {[
                  {
                    author: 'Priya & Rahul Sharma',
                    date: 'Wedding in October 2025',
                    rating: 5,
                    comment:
                      'We hosted our wedding sangeet and reception here. The palace architecture and hospitality blew our guests away! The catering team executed our multi-cuisine menu flawlessly.',
                  },
                  {
                    author: 'Vikram Malhotra',
                    date: 'Corporate Gala in December 2025',
                    rating: 4.8,
                    comment:
                      'Excellent audio-visual setup, top-tier valet parking organization, and very cooperative management staff. Highly recommended for premium corporate events.',
                  },
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-card bg-background-secondary border border-border/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-text block">{rev.author}</span>
                        <span className="text-text-muted">{rev.date}</span>
                      </div>
                      <Rating value={rev.rating} size="xs" showValue={false} />
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking / Enquiry Card */}
          <div className="lg:col-span-4">
            <VenueBookingCard venue={selectedVenue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
