import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text selection:bg-primary/20 selection:text-primary-700">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
