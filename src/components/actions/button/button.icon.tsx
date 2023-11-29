import { Button, ButtonProps } from './button';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';

import { buttonVariants } from './variants';
import { cn } from '@/utils/cn';
import { cva } from 'class-variance-authority';

export type IconButtonProps = Omit<ButtonProps, 'endIcon' | 'startIcon'>;

const IconButtonVariants = cva('p-0', {
  variants: {
    size: {
      sm: 'w-9',
      md: 'w-10',
      lg: 'w-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
const IconVariants = cva('inline-block', {
  variants: {
    size: {
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, color, shape, children, ...props }, ref) => {
    return (
      <Button
        className={cn(
          buttonVariants({ variant, size, className, color, shape }),
          IconButtonVariants({ size }),
        )}
        ref={ref}
        {...props}
      >
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              className: cn(IconVariants({ size }), child.props.className),
            } as React.HTMLProps<HTMLElement>);
          }
          return child;
        })}
      </Button>
    );
  },
);
IconButton.displayName = 'IconButton';
