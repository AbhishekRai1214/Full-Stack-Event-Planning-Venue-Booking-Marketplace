import React from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      children,
      type = 'button',
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-primary hover:bg-primary-600 active:bg-primary-700 text-white shadow-primary-sm hover:shadow-primary-md disabled:bg-primary/50',
      secondary:
        'bg-white border-2 border-primary text-primary hover:bg-primary-50 active:bg-primary-100 disabled:border-primary/40 disabled:text-primary/40',
      outline:
        'bg-transparent border border-border text-text hover:bg-background-secondary active:bg-border/40 disabled:opacity-40',
      ghost:
        'bg-transparent text-text-muted hover:text-text hover:bg-background-secondary active:bg-border/30 disabled:opacity-40',
      danger:
        'bg-error hover:bg-red-600 active:bg-red-700 text-white shadow-sm disabled:bg-error/50',
      dark:
        'bg-text hover:bg-neutral-800 text-white active:bg-black shadow-sm disabled:opacity-50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
      icon: 'p-2.5 text-sm aspect-square',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant] || variants.primary,
          sizes[size] || sizes.md,
          (disabled || isLoading) && 'opacity-60 cursor-not-allowed active:scale-100 shadow-none',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

