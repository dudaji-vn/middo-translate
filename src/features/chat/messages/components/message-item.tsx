import { VariantProps, cva } from 'class-variance-authority';

import { Avatar } from '@/components/data-display/avatar';
import { File } from '@easy-eva-icons/react';
import { Message } from '../types';
import { MessageImgGallery } from './message-img-gallery';
import { MessageMenu } from './message-menu';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

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
        removed: 'border',
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

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  message: Message;
  readByUsers?: User[];
}

export const MessageItem = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, sender, order, className, readByUsers, ...props }, ref) => {
    return (
      <div
        className={cn(
          'group relative flex',
          sender === 'me' ? 'justify-end pl-20' : 'pr-20',
        )}
      >
        <div className="relative w-fit">
          <div
            {...props}
            ref={ref}
            className={cn(
              messageVariants({ sender, order, status: message.status }),
              className,
              message.media?.length &&
                message.media?.length > 1 &&
                'rounded-none',
            )}
          >
            {message.content && (
              <div
                className={cn(
                  'px-3 py-2',
                  sender === 'me' ? 'bg-primary' : 'bg-background-darker',
                  message.status === 'removed' && 'bg-transparent text-text/60',
                )}
              >
                <span
                  className={cn(
                    'break-all',
                    sender === 'me' && 'text-background',
                  )}
                >
                  {message.content}
                </span>
              </div>
            )}
            {message?.media && message.media.length > 0 && (
              <>
                {message.media[0].type === 'image' && (
                  <MessageImgGallery images={message.media} />
                )}
                {message.media[0].type === 'document' && (
                  <a
                    download
                    href={message.media[0].url}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 p-2 px-3"
                  >
                    <File className="h-8 w-8 text-primary/60" />
                    <div className="flex flex-col">
                      <span title={message.media[0].name} className="text-sm">
                        {message.media[0].name}
                      </span>
                      <span className="text-xs text-primary/60">
                        {formatFileSize(message.media[0].size!)}
                      </span>
                    </div>
                  </a>
                )}
              </>
            )}
          </div>
          {readByUsers?.length && (
            <div
              className={cn(
                'ml-auto flex justify-end space-x-0.5',
                sender === 'me' ? 'mt-1' : 'absolute bottom-0 right-0',
              )}
            >
              {readByUsers?.map((user) => (
                <Avatar
                  key={user._id}
                  src={user.avatar}
                  alt={user.name}
                  className="h-4 w-4"
                />
              ))}
            </div>
          )}
          {message.status === 'pending' && (
            <div className="text-end text-sm text-text">
              <span>sending</span>
            </div>
          )}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
              sender === 'me'
                ? '-left-4 -translate-x-full'
                : '-right-4 translate-x-full',
            )}
          >
            {message.status !== 'removed' && (
              <MessageMenu isMine={sender === 'me'} message={message} />
            )}
          </div>
        </div>
      </div>
    );
  },
);

MessageItem.displayName = 'MessageItem';

const formatFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let index = 0;
  while (size >= 1024) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(2)} ${units[index]}`;
};
