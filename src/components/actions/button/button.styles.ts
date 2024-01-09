import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-0  transition-all focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 font-semibold',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        outline: 'border border-input hover:bg-accent',
        ghost: 'bg-transparent',
      },
      color: {
        default:
          'bg-neutral-50 text-neutral-700 md:hover:bg-neutral-100 active:bg-neutral-200 md:active:bg-neutral-200 dark:bg-gray-700  dark:hover:bg-gray-800',
        primary:
          'text-background bg-primary md:hover:bg-primary-600 md:active:bg-primary-700 disabled:bg-primary-100 disabled:text-primary-200 ',
        secondary:
          'text-primary bg-primary-200 md:hover:bg-primary-300 md:active:bg-primary-400 active:bg-primary-400 disabled:bg-primary-100 disabled:text-primary-200',
        success:
          'bg-success md:hover:bg-success-lighter text-background active:!bg-success-darker',
        error:
          'bg-error md:hover:bg-error-500 text-background active:!bg-error-600',
      },
      size: {
        xs: 'py-2 px-3',
        sm: 'py-3 px-4',
        md: 'py-3 px-5',
        lg: 'px-7 py-4',
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
          'border-primary text-primary md:hover:bg-primary md:hover:text-background bg-transparent md:active:!bg-transparent active:!bg-transparent active:border-shading active:text-shading md:active:text-shading',
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
          'bg-transparent text-neutral-700 md:hover:bg-neutral-50 active:!bg-neutral-100 disabled:!bg-transparent disabled:text-neutral-50',
      },
      {
        variant: 'ghost',
        color: 'primary',
        className:
          'bg-transparent text-primary md:hover:bg-primary-200 active:!bg-primary-300 disabled:!bg-transparent disabled:text-primary-200 disabled:bg-primary-100',
      },
      {
        variant: 'ghost',
        color: 'error',
        className:
          'bg-transparent text-error md:hover:bg-error00 active:!bg-rose-300 disabled:!bg-transparent disabled:!opacity-30',
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
