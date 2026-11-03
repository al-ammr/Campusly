'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  'aria-label'?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText,
      fullWidth = false,
      disabled,
      className,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold transition-colors duration-fast select-none outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-focusRing focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const sizeStyles = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-12 px-6 text-[13px]',
      lg: 'h-14 px-8 text-sm',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-brand text-white dark:text-ink hover:bg-brand-strong active:bg-brand-strong rounded-md h-12 px-6 text-[13px] leading-4 tracking-wide shadow-elevation0 active:scale-[0.99]',
      secondary:
        'bg-secondary text-surface hover:bg-secondary-light active:bg-secondary-light rounded-md h-12 px-6 text-[13px] leading-4 border border-transparent shadow-elevation0 active:scale-[0.99]',
      tertiary:
        'bg-transparent text-ink hover:text-brand active:text-brand-strong underline-offset-4 hover:underline h-12 px-4 text-[13px] leading-4',
      destructive:
        'bg-danger text-white hover:opacity-90 active:opacity-100 rounded-md h-12 px-6 text-[13px] leading-4 shadow-elevation0',
      icon:
        'bg-transparent text-ink hover:text-brand active:text-brand-strong h-11 w-11 min-h-[44px] min-w-[44px] rounded-full p-2.5',
    };

    const isIconOnly = variant === 'icon';

    if (isIconOnly && !ariaLabel && typeof children !== 'string') {
      console.warn('Button: variant="icon" requires an accessible aria-label (D03 UI-707).');
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading ? 'true' : undefined}
        aria-label={ariaLabel}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          !isIconOnly && sizeStyles[size],
          fullWidth && !isIconOnly && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span>{loadingText || children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
