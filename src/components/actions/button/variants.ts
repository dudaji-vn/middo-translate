import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center ring-offset-background  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 transition-all focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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
        primary: 'text-primary-foreground bg-primary hover:bg-primary/90',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-sm',
        md: 'h-10 px-5 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-lg',
      },
      shape: {
        circle: 'rounded-full',
        default: '',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'primary',
        className:
          'border-primary text-primary hover:bg-primary/5 hover:text-primary bg-transparent',
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
          'bg-transparent text-text hover:bg-slate-800/5 dark:hover:!bg-gray-800/50 dark:hover:text-dark-50',
      },
      {
        variant: 'ghost',
        color: 'primary',
        className:
          'text-primary bg-transparent hover:bg-primary/5 hover:text-primary',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      color: 'default',
      shape: 'default',
    },
  },
);

export const IconVariants = cva('inline-block', {
  variants: {
    type: {
      left: 'mr-2 -ml-1',
      right: 'ml-2',
      default: '',
    },
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'md',
  },
});
