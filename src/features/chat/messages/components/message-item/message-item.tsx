import {
  Dispatch,
  Fragment,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
} from 'react';

import { Avatar } from '@/components/data-display';
import { DocumentMessage } from './message-item-document';
import { ImageGallery } from './message-item-image-gallery';
import { Message } from '@/features/chat/messages/types';
import { MessageItemReactionBar } from './message-item-reaction-bar';
import { MessageItemSystem } from './message-item-system';
import { MessageItemWrapper } from './message-item-wrapper';
import { PendingStatus } from './pending-status';
import { ReadByUsers } from './read-by-users';
import { SeenTracker } from './message-item-seen-tracker';
import { TextMessage } from './message-item-text';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { messageVariants } from './variants';
import { useBoolean } from 'usehooks-ts';
import { MessageItemForward } from './message-item-forward';
import { CallMessage } from './message-item-call';
import { MessageItemReply } from './message-item-reply';
import { MessageItemPinned } from './message-item-pinned';

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  message: Message;
  readByUsers?: User[];
  showAvatar?: boolean;
  showReply?: boolean;
  direction?: 'bottom' | 'top';
  pinnedBy?: User;
}

type MessageItemContextProps = {
  isMe: boolean;
  isPending: boolean;
  message: Message;
  setActive: Dispatch<SetStateAction<boolean>>;
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
  (
    {
      message,
      sender,
      order,
      className,
      readByUsers,
      showAvatar,
      direction,
      showReply = true,
      pinnedBy,
      ...props
    },
    ref,
  ) => {
    const isMe = sender === 'me';
    const isPending = message.status === 'pending';
    const mediaLength = message.media?.length || 0;
    const isSystemMessage =
      message.type === 'notification' || message.type === 'action';

    const { value: isActive, setValue: setActive } = useBoolean(false);

    return (
      <MessageItemContext.Provider
        value={{
          isMe,
          isPending,
          message,
          setActive,
        }}
      >
        <SeenTracker />
        {isSystemMessage ? (
          <MessageItemSystem message={message} isMe={isMe} />
        ) : (
          <>
            {direction === 'bottom' && (
              <ReadByUsers readByUsers={readByUsers} isMe={isMe} />
            )}
            <div className="group relative flex flex-col">
              <div
                className={cn(
                  'relative flex',
                  isMe ? 'justify-end pl-11 md:pl-20' : 'pr-11 md:pr-20',
                  isPending && 'opacity-50',
                )}
              >
                {showAvatar ? (
                  <Avatar
                    className="mb-auto mr-1 mt-0.5  shrink-0"
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    size="xs"
                  />
                ) : (
                  <div className="mb-0.5 mr-1 mt-auto size-6 shrink-0" />
                )}
                <MessageItemWrapper
                  setActive={setActive}
                  isMe={isMe}
                  message={message}
                >
                  <div
                    {...props}
                    ref={ref}
                    className={cn(
                      messageVariants({
                        sender,
                        order,
                        status: message.status,
                      }),
                      className,
                      mediaLength > 1 && 'rounded-none',
                    )}
                  >
                    {message.content && (
                      <TextMessage
                        position={isMe ? 'right' : 'left'}
                        message={message}
                        active={isActive}
                      />
                    )}
                    {message.type === 'call' && (
                      <CallMessage
                        position={isMe ? 'right' : 'left'}
                        message={message}
                        active={isActive}
                      />
                    )}
                    {message?.media && message.media.length > 0 && (
                      <Fragment>
                        {message.media[0].type === 'image' && (
                          <ImageGallery images={message.media} />
                        )}
                        {message.media[0].type === 'document' && (
                          <DocumentMessage
                            isMe={isMe}
                            file={message.media[0]}
                          />
                        )}
                      </Fragment>
                    )}
                  </div>

                  {isPending && <PendingStatus />}
                  {pinnedBy && (
                    <MessageItemPinned pinnedBy={pinnedBy} isMe={isMe} />
                  )}
                  {message.forwardOf && (
                    <MessageItemForward
                      hasParent={!!message.content}
                      message={message.forwardOf}
                      isMe={isMe}
                    />
                  )}
                  {message.hasChild && showReply && (
                    <MessageItemReply isMe={isMe} messageId={message._id} />
                  )}
                </MessageItemWrapper>
              </div>
              {message?.reactions && message.reactions.length > 0 && (
                <MessageItemReactionBar isMe={isMe} message={message} />
              )}
            </div>
            {direction === 'top' && (
              <ReadByUsers
                readByUsers={readByUsers}
                isMe={isMe}
                className="mb-2 mt-0"
              />
            )}
          </>
        )}
      </MessageItemContext.Provider>
    );
  },
);

MessageItem.displayName = 'MessageItem';
