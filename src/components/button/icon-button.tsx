import { Button, ButtonProps, buttonVariants } from '@/components/button';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';

import { cn } from '@/utils/cn';
import { cva } from 'class-variance-authority';

export type IconButtonProps = Omit<ButtonProps, 'endIcon' | 'startIcon'>;

const iconButtonVariants = cva('p-0 flex items-center justify-center', {
  variants: {
    size: {
      sm: 'w-11 h-11',
      md: 'w-12 h-12',
      lg: 'w-[60px] h-[60px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
const iconVariants = cva('inline-block', {
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
          buttonVariants({ variant, size, className, shape }),
          iconButtonVariants({ size }),
        )}
        ref={ref}
        {...props}
      >
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              className: cn(iconVariants({ size }), child.props.className),
            } as React.HTMLProps<HTMLElement>);
          }
          return child;
        })}
      </Button>
    );
  },
);
IconButton.displayName = 'IconButton';
