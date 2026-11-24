import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import VenueListingPage from '@/pages/VenueListingPage';
import VenueDetailPage from '@/pages/VenueDetailPage';
import VendorListingPage from '@/pages/VendorListingPage';
import VendorDetailPage from '@/pages/VendorDetailPage';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Spinner from '@/components/common/Spinner';
import Skeleton, { VenueCardSkeleton } from '@/components/common/Skeleton';
import Modal from '@/components/common/Modal';
import Rating from '@/components/common/Rating';
import VenueCard from '@/components/cards/VenueCard';
import VendorCard from '@/components/cards/VendorCard';
import { Sparkles, ArrowRight, CheckCircle2, Palette } from 'lucide-react';

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
  ];

  return (
    <div className="py-12 bg-background-secondary min-h-screen">
      <div className="section-container space-y-12">
        <div className="card p-8 bg-white border border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  VenueAura Design System
                </Badge>
              </div>
              <h1 className="text-display-sm md:text-display-md font-serif font-bold text-text">
                UI Component Library & Tokens
              </h1>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Palette className="w-4 h-4" />}
            >
              Test Modal
            </Button>
          </div>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-text">Button Styles</h2>
          <div className="card p-6 bg-white border border-border flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="dark">Dark</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" isLoading>Loading</Button>
          </div>
        </section>

        {/* Badges & Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-text">Marketplace Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Design System Modal"
      >
        <div className="space-y-4 text-sm text-text">
          <p>Accessible Modal with portal & scroll-lock.</p>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
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
            Back to Home
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
        {/* Phase 3 Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Design System Reference */}
        <Route path="/design-system" element={<DesignSystemShowcase />} />

        {/* Other Platform Routes */}
        {/* Phase 4 Venue Marketplace */}
        <Route path="/venues" element={<VenueListingPage />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />
        {/* Phase 5 Vendor Marketplace */}
        <Route path="/vendors" element={<VendorListingPage />} />
        <Route path="/vendors/:id" element={<VendorDetailPage />} />
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
