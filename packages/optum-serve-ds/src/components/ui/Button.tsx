import React from 'react';
import { cn } from '../../utils/cn';
import type { Size, Variant } from '../../types';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const base = [
  'inline-flex items-center justify-center gap-2',
  'font-medium rounded border transition-all duration-150',
  'focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-orange-500 focus-visible:ring-offset-2',
  'disabled:opacity-40 disabled:pointer-events-none',
  'select-none whitespace-nowrap',
].join(' ');

const variants: Record<Variant, string> = {
  primary:   'bg-[#FF612B] text-white border-[#FF612B] hover:bg-[#CC4D22] hover:border-[#CC4D22] active:scale-[0.98]',
  secondary: 'bg-transparent text-[#0067B1] border-[#0067B1] hover:bg-[#E6F2FA] active:scale-[0.98]',
  ghost:     'bg-transparent text-[#FF612B] border-[#FF612B] hover:bg-[#FFF0EB] active:scale-[0.98]',
  danger:    'bg-transparent text-[#C62828] border-[#C62828] hover:bg-[#FEECEC] active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-3.5 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Spinner size={size} />
        ) : (
          iconLeft && <span className="shrink-0">{iconLeft}</span>
        )}
        {children}
        {!loading && iconRight && (
          <span className="shrink-0">{iconRight}</span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

function Spinner({ size }: { size: Size }) {
  const dim = size === 'xs' || size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <svg
      className={cn(dim, 'animate-spin')}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
