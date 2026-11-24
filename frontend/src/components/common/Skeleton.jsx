import React from 'react';
import { cn } from '@/utils';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-neutral-200/70',
        className
      )}
      {...props}
    />
  );
};

export const VenueCardSkeleton = () => {
  return (
    <div className="card overflow-hidden border border-border">
      <Skeleton className="w-full h-48 md:h-56 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4 border-t border-border flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-24 rounded-button" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
