import { cva } from 'class-variance-authority';

export const messageVariants = cva(
  'w-fit relative overflow-hidden rounded-[20px]',
  {
    variants: {
      sender: {
        me: 'ml-auto relative ',
        other: 'mr-auto',
      },
      order: {
        default: 'rounded-[20px]',
        first: '',
        middle: 'rounded-[20px]',
        last: '',
      },
      status: {
        removed: 'border border-neutral-50',
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
