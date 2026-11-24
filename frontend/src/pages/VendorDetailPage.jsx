import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDetail, toggleSaveVendor } from '@/features/vendors/vendorsSlice';
import VendorPackages from '@/features/vendors/components/VendorPackages';
import VendorPortfolio from '@/features/vendors/components/VendorPortfolio';
import VendorEnquiryCard from '@/features/vendors/components/VendorEnquiryCard';
import Rating from '@/components/common/Rating';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import {
  MapPin,
  Award,
  CheckCircle2,
  Heart,
  Share2,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '@/utils';

export const VendorDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { selectedVendor, savedVendorIds, loading, error } = useSelector(
    (state) => state.vendors
  );

  const isSaved = selectedVendor && savedVendorIds.includes(selectedVendor.id);

  useEffect(() => {
    if (id) {
      dispatch(fetchVendorDetail(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  const handleSaveToggle = () => {
    if (selectedVendor) {
      dispatch(toggleSaveVendor(selectedVendor.id));
    }
  };

  if (loading && !selectedVendor) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Spinner size="lg" />
        <p className="text-text-muted text-sm mt-3">Loading vendor profile...</p>
      </div>
    );
  }

  if (error || !selectedVendor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-text mb-2">Vendor Not Found</h2>
        <p className="text-text-muted text-sm mb-6">
          The professional profile you are looking for is currently unavailable or has been removed.
        </p>
        <Link to="/vendors">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Vendors Directory
          </Button>
        </Link>
      </div>
    );
  }

  const {
    businessName,
    category,
    description,
    avatar,
    coverImage,
    location,
    experience,
    startingPrice,
    packages,
    portfolio,
    isVerified,
    ratings,
    contact,
  } = selectedVendor;

  return (
    <div className="bg-background-secondary min-h-screen py-8 lg:py-12">
      <div className="section-container space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/vendors" className="hover:text-primary transition-colors">Vendors</Link>
            <span>/</span>
            <span className="text-text font-medium truncate max-w-xs">{businessName}</span>
          </div>

          <Link to="/vendors" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to directory</span>
          </Link>
        </div>

        {/* Cover Banner & Profile Avatar Header */}
        <div className="card overflow-hidden bg-white border border-border">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 w-full bg-neutral-900 overflow-hidden">
            <img
              src={coverImage || avatar}
              alt="Cover"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Profile Bar */}
          <div className="p-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              {/* Avatar */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-card-lg overflow-hidden border-4 border-white shadow-card bg-neutral-100 shrink-0">
                <img
                  src={avatar}
                  alt={businessName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 ml-auto">
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
                      navigator.share({ title: businessName, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Vendor link copied to clipboard!');
                    }
                  }}
                  className="p-2.5 rounded-button border border-border text-text hover:bg-neutral-100 transition-colors"
                  title="Share Profile"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Stats */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm">
                  {category}
                </Badge>
                {isVerified && (
                  <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                    Verified Professional
                  </Badge>
                )}
                <Badge variant="outline" size="sm" icon={<Award className="w-3 h-3" />}>
                  {experience}+ Years Experience
                </Badge>
              </div>

              <h1 className="text-display-sm md:text-display-md font-serif font-bold text-text">
                {businessName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {location.city}, {location.state}
                </span>
                <Rating value={ratings.average} count={ratings.count} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio, Portfolio, Packages, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* About / Bio */}
            <div className="card p-6 bg-white border border-border space-y-3">
              <h3 className="font-serif font-bold text-xl text-text">About the Business</h3>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {description}
              </p>
              {location.serviceAreas && location.serviceAreas.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <span className="text-xs font-semibold text-text uppercase tracking-wider block mb-2">
                    Service Areas Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {location.serviceAreas.map((area) => (
                      <Badge key={area} variant="default" size="sm">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Packages Section */}
            <div className="card p-6 bg-white border border-border">
              <VendorPackages
                packages={packages}
                onSelectPackage={(pkg) => setSelectedPackage(pkg)}
              />
            </div>

            {/* Portfolio Grid */}
            <div className="card p-6 bg-white border border-border">
              <VendorPortfolio portfolio={portfolio} />
            </div>

            {/* Reviews */}
            <div className="card p-6 bg-white border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-serif font-bold text-xl text-text">
                  Client Reviews & Testimonials
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-text">{ratings.average}</span>
                  <Rating value={ratings.average} count={ratings.count} size="sm" showValue={false} />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    client: 'Ananya & Siddharth',
                    event: 'Wedding in November 2025',
                    rating: 5,
                    text:
                      'Outstanding professionalism! Captured every single smile and emotional tears during our pheras. The team arrived early, handled the lighting with precision, and delivered albums on time.',
                  },
                  {
                    client: 'Karan Mehra',
                    event: 'Anniversary Banquet in January 2026',
                    rating: 4.8,
                    text:
                      'Highly recommended! Communication was smooth from the initial quotation through the event execution. Transparent pricing with zero surprise charges.',
                  },
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-card bg-background-secondary border border-border/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-text block">{rev.client}</span>
                        <span className="text-text-muted">{rev.event}</span>
                      </div>
                      <Rating value={rev.rating} size="xs" showValue={false} />
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking / Enquiry Card */}
          <div className="lg:col-span-4">
            <VendorEnquiryCard
              vendor={selectedVendor}
              selectedPackage={selectedPackage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
