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
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { messageVariants } from './variants';
import { useBoolean } from 'usehooks-ts';
import { MessageItemForward } from './message-item-forward';
import { CallMessage } from './message-item-call';
import { MessageItemReply } from './message-item-reply';
import { MessageItemPinned } from './message-item-pinned';
import { Content } from './message-item-content';
import { MessageItemLinks } from './message-item-links';
import { MessageItemVideo } from './message-item-video';
import { formatTimeDisplay } from '@/features/chat/rooms/utils';
import MessageItemFlowActions from './message-item-flow-action';

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof messageVariants> {
  message: Message;
  readByUsers?: User[];
  showAvatar?: boolean;
  showReply?: boolean;
  direction?: 'bottom' | 'top';
  pinnedBy?: User;
  discussionDisabled?: boolean;
  guestId?: string;
  disabledAllActions?: boolean;
  showTime?: boolean;
  showReactionBar?: boolean;
  isDraw?: boolean;
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
      guestId,
      className,
      readByUsers,
      showAvatar,
      direction,
      showReply = true,
      pinnedBy,
      disabledAllActions,
      discussionDisabled = false,
      showTime,
      showReactionBar = true,
      isDraw = false,
      ...props
    },
    ref,
  ) => {
    const isMe = sender === 'me';
    const isPending = message.status === 'pending';
    const mediaLength = message.media?.length || 0;
    const isSystemMessage = message.type === 'action';
    const { value: isActive, setValue: setActive } = useBoolean(false);
    const flowActions = message.actions;
    return (
      <MessageItemContext.Provider
        value={{
          isMe,
          isPending,
          message,
          setActive,
        }}
      >
        <SeenTracker guestId={guestId} />
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
                  isDraw && 'pl-0 md:pl-0',
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
                  <div
                    className={cn(
                      'pointer-events-none mb-0.5 mr-1 mt-auto size-6 shrink-0',
                    )}
                  />
                )}
                <MessageItemWrapper
                  disabledAllActions={disabledAllActions}
                  discussionDisabled={discussionDisabled}
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
                      <Content
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
                        {message.media[0].type === 'video' && (
                          <MessageItemVideo file={message.media[0]} />
                        )}
                      </Fragment>
                    )}
                  </div>

                  {message?.content && (
                    <MessageItemLinks isMe={isMe} message={message} />
                  )}

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
                  {!discussionDisabled && message.hasChild && showReply && (
                    <MessageItemReply isMe={isMe} messageId={message._id} />
                  )}
                </MessageItemWrapper>

              </div>
              {showReactionBar &&
                message?.reactions &&
                message.reactions.length > 0 && (
                  <MessageItemReactionBar isMe={isMe} message={message} />
                )}
              {showTime && (
                <span
                  className={cn(
                    'mt-1  block text-xs font-light text-neutral-500',
                    isMe ? 'text-end' : 'pl-7 text-start',
                  )}
                >
                  {formatTimeDisplay(message.createdAt!)}
                </span>
              )}
              <MessageItemFlowActions actions={flowActions || []} />

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
