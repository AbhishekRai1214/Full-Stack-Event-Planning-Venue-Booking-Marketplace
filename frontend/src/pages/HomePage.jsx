import React from 'react';
import HeroSection from '@/features/home/components/HeroSection';
import BrowseByEvent from '@/features/home/components/BrowseByEvent';
import EverythingInOnePlace from '@/features/home/components/EverythingInOnePlace';
import FeaturedVenuesSection from '@/features/home/components/FeaturedVenuesSection';
import TopRatedVendorsSection from '@/features/home/components/TopRatedVendorsSection';
import BuildYourEventSection from '@/features/home/components/BuildYourEventSection';

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero with Background, Headings & Search Form */}
      <HeroSection />

      {/* 2. Browse by Event (Wedding, Birthday, Corporate, etc.) */}
      <BrowseByEvent />

      {/* 3. Everything in One Place (All 13 vendor/service categories) */}
      <EverythingInOnePlace />

      {/* 4. Featured Venues (Responsive cards, ratings, verified badge, pricing) */}
      <FeaturedVenuesSection />

      {/* 5. Top Rated Vendors (Photographers, Catering, DJ, Decor) */}
      <TopRatedVendorsSection />

      {/* 6. Build Your Event (Interactive budget calculation & utilization) */}
      <BuildYourEventSection />
    </div>
  );
};

export default HomePage;
