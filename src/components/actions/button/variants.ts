import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground ',
        outline: 'border border-input hover:bg-accent',
        ghost: 'bg-transparent',
      },
      color: {
        default:
          'bg-gray-200 text-text hover:bg-gray-300 dark:bg-gray-700  dark:hover:bg-gray-800',
        primary:
          'text-background bg-primary hover:bg-secondary active:bg-shading',
        secondary:
          'text-primary bg-lighter hover:bg-secondary active:bg-primary active:text-background',
        success:
          'bg-success md:hover:bg-success-lighter text-background active:!bg-success-darker',
        error:
          'bg-error md:hover:bg-error-lighter text-background active:!bg-error-darker',
      },
      size: {
        xs: 'h-7 px-3 text-xs rounded-sm',
        sm: 'h-9 px-4 text-sm rounded-sm',
        md: 'h-10 px-5 text-base rounded-md',
        lg: 'px-8 py-4 text-base font-semibold',
      },
      shape: {
        square: 'rounded-xl',
        default: 'rounded-full',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'primary',
        className:
          'border-primary text-primary hover:bg-primary hover:text-background bg-transparent active:bg-transparent active:border-shading active:text-shading',
      },
      {
        variant: 'outline',
        color: 'default',
        className:
          'border bg-transparent text-slate-800  hover:bg-gray-700 dark:border dark:border-gray-600 dark:bg-transparent dark:text-gray-600 dark:hover:bg-gray-700',
      },
      {
        variant: 'ghost',
        color: 'default',
        className:
          'bg-transparent text-gray-500 md:hover:bg-background-darker active:!bg-stroke disabled:!bg-transparent',
      },
      {
        variant: 'ghost',
        color: 'primary',
        className:
          'bg-transparent text-primary md:hover:bg-lighter active:!bg-secondary disabled:!bg-transparent disabled:!opacity-30',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'lg',
      color: 'primary',
      shape: 'default',
    },
  },
);
export const IconButtonVariants = cva('p-0', {
  variants: {
    size: {
      xs: 'w-9 h-9',
      sm: 'w-11 h-11',
      md: 'w-12 h-12',
      lg: 'w-[60px] h-[60px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const IconVariants = cva('inline-block', {
  variants: {
    type: {
      left: 'mr-[0.625rem] -ml-1',
      right: 'ml-2',
      default: '',
    },
    size: {
      xs: 'w-5 h-5',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      unset: '',
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'md',
  },
});
