/**
 * ProtectedRoute Component
 *
 * Enforces authentication. If unauthenticated, redirects to /login.
 * Saves current location in state so user is redirected back after login.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '@/features/auth/authSlice';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="section-container py-24 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-card border border-border shadow-card">
            <h2 className="text-2xl font-serif font-bold text-text mb-2">Access Denied</h2>
            <p className="text-text-muted text-sm mb-6">
              You do not have permission to access this page. Required role: {allowedRoles.join(', ')}.
            </p>
            <a
              href="/"
              className="inline-block px-5 py-2.5 rounded-button bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
