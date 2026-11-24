import React from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className, color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'text-primary',
    white: 'text-white',
    neutral: 'text-neutral-500',
  };

  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizes[size] || sizes.md,
        colors[color] || colors.primary,
        className
      )}
    />
  );
};

export const LoadingScreen = ({ message = 'Loading VenueAura...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Spinner size="lg" />
      </div>
      <p className="text-text font-serif font-medium text-lg">{message}</p>
      <p className="text-text-muted text-sm mt-1">Please wait a moment</p>
    </div>
  );
};

export default Spinner;

