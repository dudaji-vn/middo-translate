import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-0  transition-all focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-75 font-medium',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        outline: 'border border-input hover:bg-accent',
        ghost: 'bg-transparent',
      },
      color: {
        default:
          'bg-neutral-50 text-neutral-700 md:hover:bg-neutral-100 active:!bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-100 dark:active:!bg-neutral-700',
        primary:
          'text-background bg-primary md:hover:bg-primary-600 md:active:bg-primary-700 disabled:bg-primary-100 disabled:text-primary-200 dark:text-neutral-100 dark:disabled:!bg-primary-900  dark:disabled:!text-primary-800',
        secondary:
          'text-primary bg-primary-200 md:hover:bg-primary-300 md:active:bg-primary-400 active:bg-primary-400 dark:bg-primary-900 dark:text-primary-500 dark:md:hover:bg-primary-800 dark:md:active:bg-primary-700 disabled:!bg-primary-100 disabled:!text-primary-200',
        success:
          'bg-success md:hover:bg-success-lighter text-background active:!bg-success-darker dark:bg-success-700 dark:text-neutral-50 dark:md:hover:bg-success-8000 active:!bg-success-400 dark:active:!bg-success-900 dark:disabled:!bg-success-900 dark:disabled:!text-success-800',
        error:
          'bg-error md:hover:bg-error-500 text-background active:!bg-error-600 disabled:bg-error-200 dark:disabled:!bg-error-900 dark:disabled:!text-error-800 dark:text-neutral-50',
        disabled:
          'bg-primary-100 text-primary-200 disabled:bg-primary-100 disabled:text-primary-200 dark:bg-neutral-800',
      },
      size: {
        ss: 'py-1 px-2',
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
          'bg-transparent text-neutral-700 md:hover:bg-neutral-50 active:!bg-neutral-100 dark:active:!bg-neutral-700 disabled:!bg-transparent disabled:text-neutral-100 dark:bg-transparent',
      },
      {
        variant: 'ghost',
        color: 'primary',
        className:
          'bg-transparent text-primary md:hover:bg-primary-200 active:!bg-primary-300 disabled:!bg-transparent disabled:text-primary-200 dark:md:hover:bg-neutral-800 dark:md:active:!bg-neutral-700 dark:text-primary',
      },
      {
        variant: 'ghost',
        color: 'error',
        className:
          'bg-transparent text-error md:hover:bg-neutral-50 active:!bg-neutral-100 disabled:!bg-transparent disabled:!text-error-100 dark:!bg-transparent dark:text-error dark:hover:!bg-neutral-900 dark:active:!bg-neutral-800 dark:disabled:!text-error-900 dark:disabled:!bg-transparent disabled:!opacity-100',
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
export const IconButtonVariants = cva('p-0 shrink-0', {
  variants: {
    size: {
      ss: 'md:w-7 md:h-7 w-9 h-9',
      xs: 'md:w-9 md:h-9 w-11 h-11',
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
      left: 'mr-[0.625rem]',
      right: 'ml-2',
      default: '',
    },
    size: {
      ss: 'w-4 h-4',
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
