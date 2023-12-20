import { Fragment, createContext, forwardRef, useContext } from 'react';

import { DocumentMessage } from './message-item.document';
import { ImageGallery } from './message-item.image-gallery';
import { Menu } from './menu';
import { Message } from '@/features/chat/messages/types';
import { MessageItemSystem } from './message-item.system';
import { MessageItemWrapper } from './message-item.wrapper';
import { PendingStatus } from './pending-status';
import { ReadByUsers } from './read-by-users';
import { SeenTracker } from './message-item.seen-tracker';
import { TextMessage } from './text-message';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { messageVariants } from './variants';

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  message: Message;
  readByUsers?: User[];
}

type MessageItemContextProps = {
  isMe: boolean;
  isPending: boolean;
  message: Message;
};

const MessageItemContext = createContext<MessageItemContextProps | undefined>(
  undefined,
);

export const useMessageItem = () => {
  const context = useContext(MessageItemContext);
  if (context === undefined) {
    throw new Error('useMessageItem must be used within a MessageItem');
  }
  return context;
};

export const MessageItem = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, sender, order, className, readByUsers, ...props }, ref) => {
    const isMe = sender === 'me';
    const isPending = message.status === 'pending';
    const mediaLength = message.media?.length || 0;

    if (message.type === 'notification') {
      return (
        <MessageItemSystem
          senderName={message.sender.name}
          content={message.content}
        />
      );
    }

    return (
      <MessageItemContext.Provider
        value={{
          isMe,
          isPending,
          message,
        }}
      >
        <MessageItemWrapper>
          <SeenTracker />
          <div className="relative">
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
                <Fragment>
                  {message.media[0].type === 'image' && (
                    <ImageGallery images={message.media} />
                  )}
                  {message.media[0].type === 'document' && (
                    <DocumentMessage isMe={isMe} file={message.media[0]} />
                  )}
                </Fragment>
              )}
            </div>
            <ReadByUsers readByUsers={readByUsers} isMe={isMe} />
            {isPending && <PendingStatus />}
            <Menu isMe={isMe} message={message} />
          </div>
        </MessageItemWrapper>
      </MessageItemContext.Provider>
    );
  },
);

MessageItem.displayName = 'MessageItem';
