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
};

export const Item = ({
  children,
  leftIcon,
  right,
  className,
  onClick,
  danger,
}: ItemProps) => {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 bg-white px-3 py-3',
        className,
        onClick && 'cursor-pointer hover:bg-primary-100 active:bg-primary-200',
        danger && 'text-error',
        onClick && danger && 'hover:bg-error-100/20 active:bg-error-200',
      )}
      onClick={onClick}
    >
      {leftIcon && (
        <IconWrapper danger={danger} size="sm">
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
};

export const IconWrapper = ({
  children,
  type,
  className,
  size,
  danger,
}: IconWrapperProps) => {
  return (
    <div
      className={cn(
        'flex size-10 items-center justify-center rounded-xl bg-primary-100 text-primary',
        danger && 'bg-error-100 text-error',
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
