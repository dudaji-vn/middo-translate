import { cva } from 'class-variance-authority';

export const wrapperVariants = cva('px-3 py-2', {
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

export const textVariants = cva('break-word-mt text-start text-sm', {
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
    },
  },

  defaultVariants: {
    position: 'left',
    status: 'sent',
  },
});
