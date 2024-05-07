import { cva } from 'class-variance-authority';

export const wrapperVariants = cva('px-3 py-2 md:py-1', {
  variants: {
    position: {
      left: 'bg-neutral-50',
      right: 'bg-primary',
    },
    status: {
      removed: 'bg-transparent',
      pending: '',
      sent: '',
      received: '',
      read: '',
      edited: '',
    },
    active: {
      true: '',
      false: '',
    },
  },

  compoundVariants: [
    {
      position: 'left',
      active: true,
      className: 'bg-neutral-100',
    },
    {
      position: 'right',
      active: true,
      className: 'bg-primary-600',
    },
  ],

  defaultVariants: {
    position: 'left',
    status: 'sent',
    active: false,
  },
});

export const wrapperMiddleVariants = cva(
  'mt-1s smb-2 rounded-md p-0.5 px-2 bg-white/90',
  {
    variants: {
      position: {
        left: 'bg-neutral-100/80',
        right: 'bg-primary-400s bg-white/20',
      },
      status: {
        removed: 'bg-transparent',
        pending: '',
        sent: '',
        received: '',
        read: '',
        edited: '',
      },
      active: {
        true: '',
        false: '',
      },
    },

    compoundVariants: [
      {
        position: 'left',
        active: true,
        className: 'bg-neutral-100',
      },
      {
        position: 'right',
        active: true,
        className: 'bg-primary-600',
      },
    ],

    defaultVariants: {
      position: 'left',
      status: 'sent',
      active: false,
    },
  },
);

export const textVariants = cva(
  'break-word-mt text-start text-base md:text-sm',
  {
    variants: {
      position: {
        left: '',
        right: 'text-neutral-white',
      },
      status: {
        removed: 'text-neutral-300',
        pending: '',
        sent: '',
        received: '',
        read: '',
        edited: '',
      },
    },

    defaultVariants: {
      position: 'left',
      status: 'sent',
    },
  },
);
export const textMiddleVariants = cva(
  'break-word-mt text-start test-base md:text-sm',
  {
    variants: {
      position: {
        left: '',
        right: 'text-background',
      },
      status: {
        removed: 'text-neutral-600',
        pending: '',
        sent: '',
        received: '',
        read: '',
        edited: '',
      },
    },

    defaultVariants: {
      position: 'left',
      status: 'sent',
    },
  },
);
