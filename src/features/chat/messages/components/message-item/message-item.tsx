import { DocumentMessage } from './document-message';
import { ImgGallery } from './img-gallery';
import { Menu } from './menu';
import { Message } from '@/features/chat/messages/types';
import { PendingStatus } from './pending-status';
import { ReadByUsers } from './read-by-users';
import { SeenIndicator } from './seen-indicator';
import { TextMessage } from './text-message';
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
    const userId = useAuthStore((state) => state!.user!._id);
    const isPending = message.status === 'pending';
    const isRead = message.readBy?.includes(userId);
    const mediaLength = message.media?.length || 0;

    if (message.type === 'notification') {
      return (
        <div className="mx-auto p-4">
          <span className="text-sm font-light text-colors-neutral-500">
            {message.sender.name + ' '}
            <div
              className="inline-block"
              dangerouslySetInnerHTML={{ __html: message.content }}
            ></div>
          </span>
        </div>
      );
    }

    return (
      <div
        className={cn(
          'group relative flex',
          isMe ? 'justify-end md:pl-20' : 'md:pr-20',
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
              mediaLength > 1 && 'rounded-none',
            )}
          >
            {message.content && <TextMessage isMe={isMe} message={message} />}
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
