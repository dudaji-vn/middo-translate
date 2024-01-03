import { Children, cloneElement, isValidElement } from 'react';

import { IconVariants } from './button.styles';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

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
            className: cn(
              IconVariants({ type, size }),
              className,
              child.props.className,
            ),
          } as React.HTMLProps<HTMLElement>);
        }
        return child;
      })}
    </>
  );
};
