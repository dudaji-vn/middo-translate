import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '@/utils/cn';
import { cva } from 'class-variance-authority';

type ItemProps = {
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export const Item = ({ children, leftIcon, right, className }: ItemProps) => {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 rounded-xl bg-neutral-50 px-3 py-3',
        className,
      )}
    >
      {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      {children}
      <div className="ml-auto flex">{right}</div>
    </div>
  );
};

export const IconWrapperVariants = cva('inline-block', {
  variants: {
    type: {
      left: 'mr-[0.625rem] -ml-1',
      right: 'ml-2',
      default: '',
    },
    size: {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      unset: '',
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'xs',
  },
});

type IconWrapperProps = {
  children: React.ReactNode;
  type?: 'left' | 'right';
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'unset';
};

const IconWrapper = ({ children, type, className, size }: IconWrapperProps) => {
  return (
    <>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            className: cn(IconWrapperVariants({ type, size }), className),
          } as React.HTMLProps<HTMLElement>);
        }
        return child;
      })}
    </>
  );
};
