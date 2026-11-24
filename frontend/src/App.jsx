import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Spinner from '@/components/common/Spinner';
import Skeleton, { VenueCardSkeleton } from '@/components/common/Skeleton';
import Modal from '@/components/common/Modal';
import Rating from '@/components/common/Rating';
import VenueCard from '@/components/cards/VenueCard';
import VendorCard from '@/components/cards/VendorCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  Palette,
  ExternalLink,
} from 'lucide-react';

function DesignSystemShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedVenues, setSavedVenues] = useState(['1']);

  const handleToggleSave = (id) => {
    setSavedVenues((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const sampleVenues = [
    {
      id: '1',
      name: 'The Oberoi Rajvilas Palace',
      city: 'Jaipur, Rajasthan',
      image:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      capacity: { min: 250, max: 1500 },
      startingPrice: 350000,
      pricePerPlate: 2800,
      rating: 4.9,
      reviewsCount: 168,
      isVerified: true,
      venueType: 'Heritage Palace',
    },
    {
      id: '2',
      name: 'Skyline Terrace Banquet & Lawn',
      city: 'Bandra West, Mumbai',
      image:
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      capacity: { min: 100, max: 600 },
      startingPrice: 180000,
      pricePerPlate: 2100,
      rating: 4.7,
      reviewsCount: 92,
      isVerified: true,
      venueType: 'Rooftop Lawn',
    },
    {
      id: '3',
      name: 'The Glasshouse Conservatory',
      city: 'Gurugram, Delhi NCR',
      image:
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      capacity: { min: 80, max: 400 },
      startingPrice: 125000,
      pricePerPlate: 1650,
      rating: 4.8,
      reviewsCount: 64,
      isVerified: true,
      venueType: 'Indoor Glasshouse',
    },
  ];

  const sampleVendors = [
    {
      id: 'v1',
      name: 'Studio Lumière Photography',
      category: 'Photography',
      city: 'Mumbai & Goa',
      image:
        'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
      experience: '10+ Years',
      startingPrice: 65000,
      rating: 4.9,
      reviewsCount: 112,
      isVerified: true,
    },
    {
      id: 'v2',
      name: 'Royal Feast Gourmet Catering',
      category: 'Catering',
      city: 'Delhi NCR',
      image:
        'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
      experience: '15+ Years',
      startingPrice: 120000,
      rating: 4.8,
      reviewsCount: 84,
      isVerified: true,
    },
  ];

  return (
    <div className="py-12 bg-background-secondary min-h-screen">
      <div className="section-container space-y-12">
        {/* Phase Header Banner */}
        <div className="card p-8 bg-white border border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  Phase 2 UI Foundation
                </Badge>
                <Badge variant="success" size="md">
                  Active Design System
                </Badge>
              </div>
              <h1 className="text-display-sm md:text-display-md font-serif font-bold text-text">
                VenueAura Component Library & UI System
              </h1>
              <p className="text-text-muted mt-1 max-w-2xl text-sm md:text-base">
                Explore the modular design system tokens, responsive navbar, footer, cards, badges, and modals crafted for the VenueAura marketplace.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Palette className="w-4 h-4" />}
              >
                Test Modal
              </Button>
            </div>
          </div>
        </div>

        {/* 1. Design Tokens: Colors & Typography */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-text">1. Color Palette & Tokens</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Primary (#00C853)', bg: 'bg-primary', text: 'text-white' },
              { label: 'Primary Dark (#009B45)', bg: 'bg-primary-600', text: 'text-white' },
              { label: 'Secondary Bg (#F7F8F6)', bg: 'bg-background-secondary border border-border', text: 'text-text' },
              { label: 'Text Dark (#171717)', bg: 'bg-text', text: 'text-white' },
              { label: 'Muted Text (#777777)', bg: 'bg-[#777777]', text: 'text-white' },
              { label: 'Border Gray (#E8E8E8)', bg: 'bg-[#E8E8E8]', text: 'text-text' },
            ].map((c) => (
              <div key={c.label} className="card p-3 border border-border">
                <div className={`h-12 rounded-md ${c.bg} flex items-center justify-center font-medium text-xs mb-2 shadow-xs`} />
                <span className="text-xs font-semibold text-text block truncate">{c.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Reusable Buttons & Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-text">2. Interactive Button Variants</h2>
          <div className="card p-6 bg-white border border-border">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="dark">Dark Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Large
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Badges, Ratings & Status Indicators */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-text">3. Badges & Ratings</h2>
          <div className="card p-6 bg-white border border-border flex flex-wrap items-center gap-4">
            <Badge variant="primary">Primary Badge</Badge>
            <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>Verified</Badge>
            <Badge variant="warning">Pending Approval</Badge>
            <Badge variant="danger">Unavailable</Badge>
            <Badge variant="info">Featured</Badge>
            <Badge variant="outline">Banquet Hall</Badge>
            <div className="h-6 w-px bg-border mx-2" />
            <Rating value={4.9} count={128} size="sm" />
            <Rating value={3.5} count={42} size="md" />
          </div>
        </section>

        {/* 4. Venue Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-text">4. Venue Marketplace Cards</h2>
              <p className="text-xs text-text-muted">Responsive cards with image zoom, rating badge, capacity & pricing</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVenues.map((v) => (
              <VenueCard
                key={v.id}
                venue={v}
                isSaved={savedVenues.includes(v.id)}
                onSaveToggle={handleToggleSave}
              />
            ))}
          </div>
        </section>

        {/* 5. Vendor Cards Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-text">5. Event Vendor Profile Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>

        {/* 6. Loading States & Skeletons */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-text">6. Loading States & Shimmer Skeletons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VenueCardSkeleton />
            <div className="card p-6 border border-border flex flex-col items-center justify-center space-y-3">
              <Spinner size="lg" />
              <p className="text-xs text-text-muted">Loading spinner component</p>
            </div>
            <div className="card p-6 border border-border space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-9 w-28 rounded-button" />
            </div>
          </div>
        </section>
      </div>

      {/* Test Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="VenueAura Design System Modal"
      >
        <div className="space-y-4 text-sm text-text">
          <p>
            This reusable accessible modal utilizes React Portals, backdrop blur, Esc key dismissal, and scroll lock behavior.
          </p>
          <div className="p-4 bg-background-secondary rounded-card border border-border">
            <span className="font-semibold block mb-1">Theme Token Check</span>
            <span className="text-xs text-text-muted">
              Emerald Green #00C853 · Playfair Display Serif · Inter Sans-serif · Rounded Cards
            </span>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-background-secondary">
      <div className="card max-w-lg w-full p-8 border border-border">
        <h2 className="text-2xl font-serif font-bold text-text mb-2">{title}</h2>
        <p className="text-sm text-text-muted mb-6">{description}</p>
        <Link to="/">
          <Button variant="primary" size="sm">
            Back to Design System Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DesignSystemShowcase />} />
        <Route
          path="/venues"
          element={
            <PlaceholderPage
              title="Venues Marketplace"
              description="Phase 4 will implement the full venue directory, search filters, and venue detail pages."
            />
          }
        />
        <Route
          path="/vendors"
          element={
            <PlaceholderPage
              title="Vendors Directory"
              description="Phase 5 will implement vendor categories, portfolios, and booking enquiry flows."
            />
          }
        />
        <Route
          path="/compare"
          element={
            <PlaceholderPage
              title="Compare Venues & Vendors"
              description="Phase 10 will deliver side-by-side comparison tables."
            />
          }
        />
        <Route
          path="/budget"
          element={
            <PlaceholderPage
              title="Budget Planner"
              description="Phase 9 will implement the interactive budget calculator and category tracker."
            />
          }
        />
        <Route
          path="/about"
          element={
            <PlaceholderPage
              title="About VenueAura"
              description="Platform story, trust statistics, and team showcase."
            />
          }
        />
        <Route
          path="/contact"
          element={
            <PlaceholderPage
              title="Contact Us"
              description="Phase 11 will integrate contact inquiries with MongoDB."
            />
          }
        />
        <Route
          path="/login"
          element={
            <PlaceholderPage
              title="Sign In"
              description="Phase 6 will implement full JWT authentication & RBAC."
            />
          }
        />
        <Route
          path="/register"
          element={
            <PlaceholderPage
              title="Create Account"
              description="Customer, Vendor, and Admin registration."
            />
          }
        />
        <Route
          path="*"
          element={
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-4xl font-serif font-bold text-primary mb-2">404</h2>
              <p className="text-text-muted mb-4">Page not found</p>
              <Link to="/">
                <Button variant="primary" size="sm">
                  Return Home
                </Button>
              </Link>
            </div>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
