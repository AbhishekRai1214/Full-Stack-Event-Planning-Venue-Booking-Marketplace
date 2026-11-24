import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, User, Heart, ChevronDown } from 'lucide-react';
import Button from '@/components/common/Button';
import { cn } from '@/utils';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Venues', path: '/venues' },
    { name: 'Vendors', path: '/vendors' },
    { name: 'Compare', path: '/compare' },
    { name: 'Budget Planner', path: '/budget' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b',
        isScrolled ? 'border-border shadow-xs py-3' : 'border-transparent py-4'
      )}
    >
      <div className="section-container flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-primary-sm transition-transform duration-300 group-hover:scale-105">
            <span className="font-serif font-black text-2xl tracking-tight">V</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-text leading-none">
              Venue<span className="text-primary">Aura</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-text-muted font-medium mt-0.5">
              Celebration Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-primary py-1 relative',
                  isActive
                    ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'
                    : 'text-text-muted'
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth / Action CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/saved" className="p-2 text-text-muted hover:text-primary hover:bg-neutral-100 rounded-button transition-colors" title="Saved items">
            <Heart className="w-5 h-5" />
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-text rounded-button hover:bg-neutral-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-dropdown px-4 pt-3 pb-6 animate-slide-up">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text hover:bg-neutral-50'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-2.5">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full" size="md">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button variant="primary" className="w-full" size="md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

