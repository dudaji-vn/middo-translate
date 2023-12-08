import { DocumentMessage } from './document-message';
import { ImgGallery } from './img-gallery';
import { Menu } from './menu';
import { Message } from '@/features/chat/messages/types';
import { PendingStatus } from './pending-status';
import { ReadByUsers } from './read-by-users';
import { SeenIndicator } from './seen-indicator';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { messageVariants } from './variants';
import { useAuthStore } from '@/stores/auth';

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  message: Message;
  readByUsers?: User[];
}

export const MessageItem = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, sender, order, className, readByUsers, ...props }, ref) => {
    const isMe = sender === 'me';
    const userId = useAuthStore((state) => state.user._id);
    const isPending = message.status === 'pending';
    const isRead = message.readBy?.includes(userId);

    return (
      <div
        className={cn(
          'group relative flex',
          isMe ? 'justify-end pl-20' : 'pr-20',
          isPending && 'opacity-50',
        )}
      >
        {!isRead && (
          <SeenIndicator
            onSeen={() => {
              console.log('seen', message._id);
            }}
          />
        )}
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
                  isMe ? 'bg-primary' : 'bg-colors-neutral-50',
                  message.status === 'removed' && 'bg-transparent',
                )}
              >
                <span
                  className={cn(
                    'break-word-mt',
                    isMe && 'text-background',
                    message.status === 'removed' && 'text-neutral-300',
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
                  <DocumentMessage isMe={isMe} file={message.media[0]} />
                )}
              </>
            )}
          </div>
          <ReadByUsers readByUsers={readByUsers} isMe={isMe} />
          {isPending && <PendingStatus />}
          <Menu isMe={isMe} message={message} />
        </div>
      </div>
    );
  },
);

MessageItem.displayName = 'MessageItem';
