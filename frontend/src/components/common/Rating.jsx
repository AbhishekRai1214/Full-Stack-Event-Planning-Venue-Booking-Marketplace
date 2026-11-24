import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils';

export const Rating = ({
  value = 0,
  max = 5,
  count,
  size = 'sm',
  showValue = true,
  className,
}) => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((starIndex) => {
          const isFilled = starIndex <= Math.round(value);
          return (
            <Star
              key={starIndex}
              className={cn(
                iconSizes[size] || iconSizes.sm,
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-neutral-200 text-neutral-200'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-text">
          {Number(value).toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-text-muted">({count})</span>
      )}
    </div>
  );
};

export default Rating;

