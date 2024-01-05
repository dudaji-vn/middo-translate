import { Button, ButtonProps } from './button';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import {
  IconButtonVariants,
  IconVariants,
  buttonVariants,
} from './button.styles';

import { cn } from '@/utils/cn';

export type IconButtonProps = Omit<ButtonProps, 'endIcon' | 'startIcon'>;

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
