import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVenues, setFilters, resetFilters, toggleSaveVenue } from '@/features/venues/venuesSlice';
import VenueCard from '@/components/cards/VenueCard';
import VenueFilters from '@/features/venues/components/VenueFilters';
import { VenueCardSkeleton } from '@/components/common/Skeleton';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
} from 'lucide-react';

export const VenueListingPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { venues, meta, filters, savedVenueIds, loading } = useSelector(
    (state) => state.venues
  );

  // Sync URL search parameters on mount
  useEffect(() => {
    const urlFilters = {};
    if (searchParams.get('city')) urlFilters.city = searchParams.get('city');
    if (searchParams.get('eventType')) urlFilters.eventType = searchParams.get('eventType');
    if (searchParams.get('venueType')) urlFilters.venueType = searchParams.get('venueType');
    if (searchParams.get('search')) urlFilters.search = searchParams.get('search');
    if (searchParams.get('page')) urlFilters.page = Number(searchParams.get('page'));

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }
  }, [searchParams, dispatch]);

  // Trigger API fetch whenever filters change
  useEffect(() => {
    dispatch(fetchVenues(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (newValues) => {
    dispatch(setFilters({ ...newValues, page: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToggle = (id) => {
    dispatch(toggleSaveVenue(id));
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([k, v]) => v && k !== 'sort' && k !== 'page' && k !== 'limit'
  ).length;

  return (
    <div className="bg-background-secondary min-h-screen py-8 lg:py-12">
      <div className="section-container space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>Home</span>
            <span>/</span>
            <span className="text-text font-medium">Venues Directory</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-display-sm md:text-display-md font-serif font-bold text-text">
                Discover Perfect Venues
              </h1>
              <p className="text-text-muted text-sm mt-1">
                Explore luxury banquets, heritage palaces, rooftop decks, and scenic lawns across India.
              </p>
            </div>

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileFiltersOpen(true)}
                leftIcon={<Filter className="w-4 h-4 text-primary" />}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>
          </div>
        </div>

        {/* Top Control Bar: Search Input & Sort Selector */}
        <div className="card p-4 bg-white border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by venue name, palace, or city..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="input-field pl-9 text-xs sm:text-sm py-2 bg-background-secondary border-neutral-200"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs">
            <span className="text-text-muted font-medium shrink-0">
              {meta.total} Venues Found
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="input-field text-xs py-1.5 px-3 bg-background-secondary border-neutral-200 font-medium"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Venue Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <VenueFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Venue Cards List */}
          <div className="lg:col-span-3 space-y-8">
            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VenueCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!loading && venues.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id || venue.slug}
                    venue={venue}
                    isSaved={savedVenueIds.includes(venue.id)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && venues.length === 0 && (
              <div className="card p-12 text-center bg-white border border-border space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-text">
                  No Venues Match Your Filters
                </h3>
                <p className="text-text-muted text-sm max-w-md mx-auto">
                  Try broadening your price range, clearing selected filters, or searching for another city.
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

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto p-4 z-10 animate-slide-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <h3 className="font-serif font-bold text-lg text-text">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <VenueFilters
              filters={filters}
              onChange={(vals) => {
                handleFilterChange(vals);
              }}
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

export default VenueListingPage;

