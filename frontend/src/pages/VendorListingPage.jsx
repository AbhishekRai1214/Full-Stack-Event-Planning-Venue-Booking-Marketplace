import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVendors,
  setVendorFilters,
  resetVendorFilters,
} from '@/features/vendors/vendorsSlice';
import VendorCard from '@/components/cards/VendorCard';
import VendorFilters from '@/features/vendors/components/VendorFilters';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Award,
} from 'lucide-react';

export const VendorListingPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { vendors, meta, filters, loading } = useSelector((state) => state.vendors);

  const categoryPills = [
    { id: '', label: 'All Services' },
    { id: 'photographer', label: 'Photographers' },
    { id: 'caterer', label: 'Caterers' },
    { id: 'decorator', label: 'Decorators' },
    { id: 'dj', label: 'DJs & Music' },
    { id: 'makeup', label: 'Makeup Artists' },
    { id: 'band', label: 'Live Bands' },
    { id: 'mehndi', label: 'Mehendi' },
    { id: 'florist', label: 'Florists' },
  ];

  // Sync URL search parameters on mount
  useEffect(() => {
    const urlFilters = {};
    if (searchParams.get('category')) urlFilters.category = searchParams.get('category');
    if (searchParams.get('city')) urlFilters.city = searchParams.get('city');
    if (searchParams.get('search')) urlFilters.search = searchParams.get('search');
    if (searchParams.get('page')) urlFilters.page = Number(searchParams.get('page'));

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setVendorFilters(urlFilters));
    }
  }, [searchParams, dispatch]);

  // Fetch vendors whenever filters change
  useEffect(() => {
    dispatch(fetchVendors(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (newValues) => {
    dispatch(setVendorFilters({ ...newValues, page: 1 }));
  };

  const handleCategorySelect = (categoryId) => {
    dispatch(setVendorFilters({ category: categoryId, page: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetVendorFilters());
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    dispatch(setVendorFilters({ page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background-secondary min-h-screen py-8 lg:py-12">
      <div className="section-container space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>Home</span>
            <span>/</span>
            <span className="text-text font-medium">Event Vendors Marketplace</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-display-sm md:text-display-md font-serif font-bold text-text">
                Hire Verified Event Professionals
              </h1>
              <p className="text-text-muted text-sm mt-1">
                Discover award-winning photographers, gourmet caterers, bespoke decorators, and live music.
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileFiltersOpen(true)}
                leftIcon={<Filter className="w-4 h-4 text-primary" />}
              >
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Category Horizontal Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categoryPills.map((pill) => {
            const isSelected = (filters.category || '') === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => handleCategorySelect(pill.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-primary-sm'
                    : 'bg-white border border-border text-text hover:bg-neutral-100'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Top Control Bar: Search & Sort */}
        <div className="card p-4 bg-white border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor by business name or service..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="input-field pl-9 text-xs sm:text-sm py-2 bg-background-secondary border-neutral-200"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs">
            <span className="text-text-muted font-medium shrink-0">
              {meta.total} Professionals Found
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="input-field text-xs py-1.5 px-3 bg-background-secondary border-neutral-200 font-medium"
              >
                <option value="newest">Featured & Newest</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="experience_desc">Most Experienced</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Filters Sidebar + Vendor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <VendorFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Vendors List */}
          <div className="lg:col-span-3 space-y-8">
            {loading && (
              <div className="p-16 flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="text-xs text-text-muted mt-2">Loading verified vendors...</p>
              </div>
            )}

            {!loading && vendors.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id || vendor.slug}
                    vendor={{
                      id: vendor.id || vendor.slug,
                      name: vendor.businessName,
                      category: vendor.category,
                      city: vendor.location?.city,
                      image: vendor.avatar,
                      experience: `${vendor.experience}+ Years`,
                      startingPrice: vendor.startingPrice,
                      rating: vendor.ratings?.average,
                      reviewsCount: vendor.ratings?.count,
                      isVerified: vendor.isVerified,
                    }}
                  />
                ))}
              </div>
            )}

            {!loading && vendors.length === 0 && (
              <div className="card p-12 text-center bg-white border border-border space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-text">
                  No Vendors Found
                </h3>
                <p className="text-text-muted text-sm max-w-md mx-auto">
                  Try adjusting your category selection, widening price limits, or clearing filters.
                </p>
                <Button variant="primary" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasPrevPage}
                  onClick={() => handlePageChange(meta.page - 1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-button text-xs font-semibold transition-all ${
                      meta.page === pageNum
                        ? 'bg-primary text-white shadow-primary-sm'
                        : 'bg-white border border-border text-text hover:bg-neutral-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasNextPage}
                  onClick={() => handlePageChange(meta.page + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto p-4 z-10 animate-slide-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <h3 className="font-serif font-bold text-lg text-text">Vendor Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <VendorFilters
              filters={filters}
              onChange={(vals) => handleFilterChange(vals)}
              onReset={() => {
                handleResetFilters();
                setIsMobileFiltersOpen(false);
              }}
            />
            <div className="pt-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorListingPage;
