import { Children, cloneElement, isValidElement } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export const IconVariants = cva('inline-block', {
  variants: {
    type: {
      left: 'mr-[10px]',
      right: 'ml-2',
      default: '',
    },
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'md',
  },
});

export interface IconProps extends VariantProps<typeof IconVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Icon = ({ children, type, className, size }: IconProps) => {
  return (
    <>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            className: cn(IconVariants({ type, size }), className),
          } as React.HTMLProps<HTMLElement>);
        }
        return child;
      })}
    </>
  );
};
