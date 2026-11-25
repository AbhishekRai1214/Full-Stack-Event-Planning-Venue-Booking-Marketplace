import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  X,
  Sparkles,
  User,
  Heart,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Shield,
  Briefcase,
} from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logoutUser,
} from '@/features/auth/authSlice';
import { cn } from '@/utils';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile and user dropdown when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Venues', path: '/venues' },
    { name: 'Vendors', path: '/vendors' },
    { name: 'Events', path: '/events' },
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
          <Link
            to="/saved"
            className="p-2 text-text-muted hover:text-primary hover:bg-neutral-100 rounded-button transition-colors"
            title="Saved items"
          >
            <Heart className="w-5 h-5" />
          </Link>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-full border border-border hover:border-primary/40 bg-neutral-50 hover:bg-white transition-all"
              >
                <img
                  src={user.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-text max-w-[120px] truncate">
                  {user.name}
                </span>
                <Badge
                  variant={
                    user.role === 'ADMIN'
                      ? 'danger'
                      : user.role === 'VENDOR'
                      ? 'warning'
                      : 'primary'
                  }
                  size="xs"
                >
                  {user.role}
                </Badge>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-border py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs text-text-muted">Signed in as</p>
                    <p className="text-sm font-semibold text-text truncate">{user.email}</p>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-text hover:bg-neutral-50 hover:text-primary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 text-secondary" />
                      <span>Admin Control Center</span>
                    </Link>
                  )}

                  {user.role === 'VENDOR' && (
                    <Link
                      to="/vendor/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-text hover:bg-neutral-50 hover:text-primary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Briefcase className="w-4 h-4 text-accent" />
                      <span>Vendor Portal</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-text hover:bg-neutral-50 hover:text-primary"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile & Bookings</span>
                  </Link>

                  <div className="border-t border-border my-1" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-1">
                    <img
                      src={user.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-text">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-red-600 hover:text-red-700"
                    size="md"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
