import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  IndianRupee,
  PartyPopper,
} from 'lucide-react';
import Button from '@/components/common/Button';

export const HeroSection = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    city: 'Mumbai',
    eventType: 'wedding',
    date: '',
    guests: '100-300',
    budget: '200000-500000',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.city) query.append('city', searchParams.city);
    if (searchParams.eventType) query.append('eventType', searchParams.eventType);
    if (searchParams.date) query.append('date', searchParams.date);
    if (searchParams.guests) query.append('guests', searchParams.guests);
    if (searchParams.budget) query.append('budget', searchParams.budget);
    navigate(`/venues?${query.toString()}`);
  };

  return (
    <section className="relative min-h-[680px] lg:min-h-[760px] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Background Hero Image with Rich Dark Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury wedding venue celebration"
          className="w-full h-full object-cover object-center scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40" />
      </div>

      {/* Main Container */}
      <div className="section-container relative z-10 w-full flex flex-col items-center text-center">
        {/* Top Floating Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>India’s Most Trusted Event Marketplace</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-display-md sm:text-display-lg md:text-display-xl lg:text-display-2xl font-serif font-bold text-white max-w-4xl tracking-tight leading-[1.15] mb-5 text-balance">
          Plan Every Celebration{' '}
          <span className="text-primary italic font-normal">Beautifully</span>
        </h1>

        <p className="text-neutral-200 text-base sm:text-lg md:text-xl max-w-2xl font-light mb-8 leading-relaxed">
          Discover handpicked royal palaces, intimate banquet lawns, and verified event vendors with guaranteed transparent pricing.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/venues')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Venues
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white/10 text-white border-white/40 hover:bg-white hover:text-text hover:border-white backdrop-blur-xs"
            onClick={() => navigate('/budget')}
            leftIcon={<Sparkles className="w-4 h-4 text-primary" />}
          >
            Plan My Event
          </Button>
        </div>

        {/* Floating Search Form Card */}
        <div className="w-full max-w-5xl bg-white rounded-card-lg shadow-modal border border-border p-4 sm:p-5 lg:p-6 text-left animate-slide-up">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 lg:gap-4 items-end">
            {/* Field 1: Location */}
            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Location</span>
              </label>
              <select
                name="city"
                value={searchParams.city}
                onChange={handleChange}
                className="input-field text-sm font-medium py-2.5 bg-background-secondary border-neutral-200"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Goa">Goa</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            {/* Field 2: Event Type */}
            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <PartyPopper className="w-3.5 h-3.5 text-primary" />
                <span>Event Type</span>
              </label>
              <select
                name="eventType"
                value={searchParams.eventType}
                onChange={handleChange}
                className="input-field text-sm font-medium py-2.5 bg-background-secondary border-neutral-200"
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday Party</option>
                <option value="engagement">Engagement</option>
                <option value="baby_shower">Baby Shower</option>
                <option value="corporate">Corporate Event</option>
                <option value="farewell">Farewell Party</option>
                <option value="anniversary">Anniversary</option>
                <option value="religious">Religious Event</option>
              </select>
            </div>

            {/* Field 3: Event Date */}
            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                <span>Event Date</span>
              </label>
              <input
                type="date"
                name="date"
                value={searchParams.date}
                onChange={handleChange}
                className="input-field text-sm font-medium py-2.5 bg-background-secondary border-neutral-200"
              />
            </div>

            {/* Field 4: Guests */}
            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Guests</span>
              </label>
              <select
                name="guests"
                value={searchParams.guests}
                onChange={handleChange}
                className="input-field text-sm font-medium py-2.5 bg-background-secondary border-neutral-200"
              >
                <option value="50-100">50 - 100 Guests</option>
                <option value="100-300">100 - 300 Guests</option>
                <option value="300-600">300 - 600 Guests</option>
                <option value="600-1200">600 - 1,200 Guests</option>
                <option value="1200+">1,200+ Guests</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full py-3 h-[46px]"
                leftIcon={<Search className="w-4 h-4" />}
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
