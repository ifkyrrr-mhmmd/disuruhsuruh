import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'default', disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
      outline: 'bg-transparent border-2 border-slate-300 hover:border-slate-400 text-slate-700',
      forest: 'bg-forest-700 hover:bg-forest-800 text-white shadow-sm',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizes = {
      sm: 'text-xs px-3 py-2 min-h-[36px]',
      default: 'text-sm px-4 py-3 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 min-h-[48px]',
      icon: 'p-2.5 min-h-[44px] min-w-[44px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
