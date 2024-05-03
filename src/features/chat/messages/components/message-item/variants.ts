import { cva } from 'class-variance-authority';

export const messageVariants = cva(
  'w-fit relative overflow-hidden rounded-[12px]',
  {
    variants: {
      sender: {
        me: 'ml-auto relative ',
        other: 'mr-auto',
      },
      order: {
        default: 'rounded-[12px]',
        first: '',
        middle: 'rounded-[12px]',
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
        className: 'rounded-tr-[4px]',
      },
      {
        sender: 'me',
        order: 'middle',
        className: 'rounded-r-[4px]',
      },
      {
        sender: 'me',
        order: 'last',
        className: 'rounded-br-[4px]',
      },
      {
        sender: 'other',
        order: 'first',
        className: 'rounded-tl-[4px]',
      },
      {
        sender: 'other',
        order: 'middle',
        className: 'rounded-l-[4px]',
      },
      {
        sender: 'other',
        order: 'last',
        className: 'rounded-bl-[4px]',
      },
    ],
    defaultVariants: {
      sender: 'other',
      order: 'default',
      status: 'sent',
    },
  },
);
