'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/utils/cn';
import { CheckIcon } from 'lucide-react';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label?: string | React.ReactNode;
  }
>(({ className, label, ...props }, ref) => {
  const id = React.useId();
  const checkId = props?.id || id;
  return (
    <div className="flex items-center">
      <CheckboxPrimitive.Root
        id={checkId}
        ref={ref}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn('flex items-center justify-center text-current')}
        >
          <CheckIcon className="h-3 w-3 text-white" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && typeof label === 'string' && (
        <label htmlFor={checkId} className="ml-2 text-sm text-neutral-600">
          {label}
        </label>
      )}
      {label && typeof label !== 'string' && (
        <div className="ml-2 ">{label}</div>
      )}
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
