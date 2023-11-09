import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Icon } from './icon';

const buttonVariants = cva(
  'inline-flex items-center w-fit whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30 rounded-full text-base justify-center ',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-background md:hover:bg-secondary border-transparent disabled:bg-lighter active:!bg-shading',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-primary hover:border-secondary bg-background hover:bg-secondary text-primary hover:text-background active:bg-transparent active:text-shading active:border-shading',
        secondary:
          'bg-lighter text-primary  md:hover:bg-secondary active:!bg-primary active:text-background',
        success:
          'bg-success md:hover:bg-success-lighter text-background active:!bg-success-darker',
        error:
          'bg-error md:hover:bg-error-lighter text-background active:!bg-error-darker',
        ghost:
          'bg-transparent text-text md:hover:bg-background-darker active:!bg-stroke',
        ghostPrimary:
          'bg-transparent text-primary md:hover:bg-lighter active:!bg-secondary disabled:!bg-transparent',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      shape: {
        circle: 'rounded-full',
        default: 'rounded-xl',
      },
      size: {
        md: 'px-8 py-4 text-base leading-tight',
        sm: 'h-9 px-3',
        lg: 'h-11  px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, children, icon, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <>
          {icon && <Icon type="left">{icon}</Icon>}
          <>{children}</>
        </>
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
