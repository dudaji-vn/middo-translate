import { cva } from 'class-variance-authority';

export const messageVariants = cva(
  'w-fit relative overflow-hidden rounded-2xl',
  {
    variants: {
      sender: {
        me: 'ml-auto relative ',
        other: 'mr-auto',
      },
      order: {
        default: 'rounded-2xl',
        first: '',
        middle: 'rounded-2xl',
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
        className: 'rounded-tr-[8px]',
      },
      {
        sender: 'me',
        order: 'middle',
        className: 'rounded-r-[8px]',
      },
      {
        sender: 'me',
        order: 'last',
        className: 'rounded-br-[8px]',
      },
      {
        sender: 'other',
        order: 'first',
        className: 'rounded-tl-[8px]',
      },
      {
        sender: 'other',
        order: 'middle',
        className: 'rounded-l-[8px]',
      },
      {
        sender: 'other',
        order: 'last',
        className: 'rounded-bl-[8px]',
      },
    ],
    defaultVariants: {
      sender: 'other',
      order: 'default',
      status: 'sent',
    },
  },
);
