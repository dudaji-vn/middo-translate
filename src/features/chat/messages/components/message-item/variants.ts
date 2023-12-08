import { cva } from 'class-variance-authority';

export const messageVariants = cva(
  'w-fit max-w-xl min-w-[2.25rem] relative overflow-hidden rounded-3xl',
  {
    variants: {
      sender: {
        me: 'ml-auto relative ',
        other: 'mr-auto',
      },
      order: {
        default: 'rounded-3xl',
        first: '',
        middle: 'rounded-3xl',
        last: '',
      },
      status: {
        removed: 'border border-colors-neutral-50',
        pending: '',
        sent: '',
        received: '',
        read: '',
      },
    },

    compoundVariants: [
      {
        sender: 'me',
        order: 'first',
        className: 'rounded-tr-lg',
      },
      {
        sender: 'me',
        order: 'middle',
        className: 'rounded-r-lg',
      },
      {
        sender: 'me',
        order: 'last',
        className: 'rounded-br-lg',
      },
      {
        sender: 'other',
        order: 'first',
        className: 'rounded-tl-lg',
      },
      {
        sender: 'other',
        order: 'middle',
        className: 'rounded-l-lg',
      },
      {
        sender: 'other',
        order: 'last',
        className: 'rounded-bl-lg',
      },
    ],
    defaultVariants: {
      sender: 'other',
      order: 'default',
      status: 'sent',
    },
  },
);
