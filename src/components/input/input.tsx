import * as React from 'react';

import { AlertCircleOutline } from '@easy-eva-icons/react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  leftElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftElement, isError, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            'flex w-full rounded-full border border-input bg-background px-5 py-[14px] text-base font-normal leading-none ring-offset-background file:bg-transparent placeholder:text-muted-foreground focus-within:border-primary focus-within:caret-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
            isError && 'border-error focus-within:border-error',
          )}
          ref={ref}
          {...props}
        />
        {isError && (
          <div className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center text-error">
            <AlertCircleOutline className="h-5 w-5" />
          </div>
        )}
        {leftElement && (
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
            {leftElement}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
