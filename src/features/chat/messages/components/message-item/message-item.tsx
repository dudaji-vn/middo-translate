import { DocumentMessage } from './document-message';
import { ImgGallery } from './img-gallery';
import { Menu } from './menu';
import { Message } from '@/features/chat/messages/types';
import { PendingStatus } from './pending-status';
import { ReadByUsers } from './read-by-users';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { messageVariants } from './variants';

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  message: Message;
  readByUsers?: User[];
}

export const MessageItem = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, sender, order, className, readByUsers, ...props }, ref) => {
    const isMine = sender === 'me';
    const isPending = message.status === 'pending';
    return (
      <div
        className={cn(
          'group relative flex',
          isMine ? 'justify-end pl-20' : 'pr-20',
          isPending && 'opacity-50',
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
                  isMine ? 'bg-primary' : 'bg-background-darker',
                  message.status === 'removed' && 'bg-transparent',
                )}
              >
                <span
                  className={cn(
                    'break-word-mt',
                    isMine && 'text-background',
                    message.status === 'removed' && 'text-text',
                  )}
                >
                  {message.content}
                </span>
              </div>
            )}
            {message?.media && message.media.length > 0 && (
              <>
                {message.media[0].type === 'image' && (
                  <ImgGallery images={message.media} />
                )}
                {message.media[0].type === 'document' && (
                  <DocumentMessage file={message.media[0]} />
                )}
              </>
            )}
          </div>
          <ReadByUsers readByUsers={readByUsers} isMine={isMine} />
          {isPending && <PendingStatus />}
          <Menu isMine={isMine} message={message} />
        </div>
      </div>
    );
  },
);

MessageItem.displayName = 'MessageItem';
