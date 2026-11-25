/**
 * Login Page
 *
 * Provides responsive email & password authentication, quick-fill demo buttons
 * for Customer, Vendor, and Admin test accounts, and clear error feedback.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  clearError,
} from '@/features/auth/authSlice';
import Button from '@/components/common/Button';
import { Lock, Mail, Sparkles, CheckCircle2, User, Building, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(clearError());
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50/60">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-border shadow-card">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-text">Welcome Back</h2>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to manage your venues, bookings, or vendor portfolio
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer@venueaura.com', 'Password123')}
              className="py-1.5 px-2 bg-white rounded-lg border border-primary-200 text-text hover:bg-primary-50 transition-colors flex items-center justify-center gap-1 font-medium"
            >
              <User className="w-3 h-3 text-primary" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('vendor@venueaura.com', 'Password123')}
              className="py-1.5 px-2 bg-white rounded-lg border border-primary-200 text-text hover:bg-primary-50 transition-colors flex items-center justify-center gap-1 font-medium"
            >
              <Building className="w-3 h-3 text-accent" />
              <span>Vendor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@venueaura.com', 'Password123')}
              className="py-1.5 px-2 bg-white rounded-lg border border-primary-200 text-text hover:bg-primary-50 transition-colors flex items-center justify-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3 h-3 text-secondary" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-text uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center"
            isLoading={isLoading}
          >
            Sign In to Account
          </Button>
        </form>

        <div className="text-center text-xs text-text-muted pt-2 border-t border-border">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
