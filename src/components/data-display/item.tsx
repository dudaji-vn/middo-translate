import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '@/utils/cn';
import { cva } from 'class-variance-authority';

type ItemProps = {
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  danger?: boolean;
  neutral?: boolean;
};

export const Item = ({
  children,
  leftIcon,
  right,
  className,
  onClick,
  danger,
  neutral,
}: ItemProps) => {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 bg-white px-3 py-3',
        className,
        onClick &&
          'cursor-pointer active:bg-primary-200 md:hover:bg-primary-100',
        danger && 'text-error',
        onClick && danger && 'active:bg-error-100/60 md:hover:bg-error-100/20',
        neutral && 'text-neutral-800',
        onClick &&
          neutral &&
          'bg-white active:bg-neutral-100/60 md:hover:bg-neutral-100/20',
      )}
      onClick={onClick}
    >
      {leftIcon && (
        <IconWrapper danger={danger} neutral={neutral} size="sm">
          {leftIcon}
        </IconWrapper>
      )}
      {children}
      <div className="ml-auto flex">{right}</div>
    </div>
  );
};

export const IconWrapperVariants = cva('inline-block', {
  variants: {
    type: {
      left: '',
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
  danger?: boolean;
  neutral?: boolean;
};

export const IconWrapper = ({
  children,
  type,
  className,
  size,
  danger,
  neutral,
}: IconWrapperProps) => {
  return (
    <div
      className={cn(
        'flex size-10 items-center justify-center rounded-xl bg-primary-100 text-primary',
        danger && 'bg-error-100 text-error',
        neutral && 'bg-neutral-50 text-neutral-800',
      )}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            className: cn(IconWrapperVariants({ type, size }), className),
          } as React.HTMLProps<HTMLElement>);
        }
        return child;
      })}
    </div>
  );
};
