import './style.css';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

const spinnerVariants = cva('spinner', {
  variants: {
    size: {
      ss: 'w-3 h-3',
      xs: 'w-3 h-3',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
export interface SpinnerProps
  extends React.HTMLAttributes<HTMLOrSVGElement>,
    VariantProps<typeof spinnerVariants> {}

export const Spinner = forwardRef<HTMLOrSVGElement, SpinnerProps>(
  ({ size, ...props }, ref) => {
    return (
      <svg
        {...props}
        className={cn('spinner', spinnerVariants({ size }), props.className)}
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
          className="path"
        ></circle>
      </svg>
    );
  },
);
Spinner.displayName = 'Spinner';
