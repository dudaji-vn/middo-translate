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

export const wrapperMiddleVariants = cva('mb-1 mt-2 rounded-xl p-1 px-3', {
  variants: {
    position: {
      left: 'bg-neutral-100',
      right: 'bg-primary-400',
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
export const textMiddleVariants = cva('break-word-mt text-start text-sm', {
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
    },
  },

  defaultVariants: {
    position: 'left',
    status: 'sent',
  },
});
