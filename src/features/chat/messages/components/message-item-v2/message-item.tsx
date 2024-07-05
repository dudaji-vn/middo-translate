import { Avatar } from '@/components/data-display';
import { Message } from '@/features/chat/messages/types';
import { User } from '@/features/users/types';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { cn } from '@/utils/cn';
import { VariantProps } from 'class-variance-authority';
import {
  Dispatch,
  Fragment,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
} from 'react';
import { useBoolean } from 'usehooks-ts';
import { CallMessage } from './message-item-call';
import { Content } from './message-item-content';
import { DocumentMessage } from './message-item-document';
import MessageItemFlowActions from './message-item-flow-action';
import { ImageGallery } from './message-item-image-gallery';
import { MessageItemPinned } from './message-extension/message-item-pinned';
import { MessageItemReply } from './message-extension/message-item-reply';
import { MessageItemSystem } from './message-item-system';
import { MessageItemVideo } from './message-item-video';
import { MessageItemWrapper } from './message-item-wrapper';
import { PendingStatus } from './pending-status';
import { ReadByUsers } from './read-by-users';
import { messageVariants } from './variants';
import { AnimatePresence } from 'framer-motion';
import { PenLineIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MessageItemLinks } from './message-extension/message-item-links';
import { MessageItemForward } from './message-item-forward';
import { SeenTracker } from './message-extension/message-item-seen-tracker';
import { MessageItemReactionBar } from './message-extension/message-item-reaction-bar';
import { MessageItemParticipantJoinCall } from './message-extension/message-item-participant-join-call';

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  message: Message;
  readByUsers?: User[];
  spaceAvatar?: string;
  showAvatar?: boolean;
  showReply?: boolean;
  direction?: 'bottom' | 'top';
  pinnedBy?: User;
  discussionDisabled?: boolean;
  guestId?: string;
  reactionDisabled?: boolean;
  actionsDisabled?: boolean;
  showTime?: boolean;
  showReactionBar?: boolean;
  isDraw?: boolean;
  isSendBySpaceMember?: boolean;
  isEditing?: boolean;
  isDiscussion?: boolean;
  isLast?: boolean;
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
      isLast,
      order,
      guestId,
      className,
      readByUsers,
      spaceAvatar,
      showAvatar,
      direction,
      showReply = true,
      pinnedBy,
      reactionDisabled = false,
      actionsDisabled = false,
      discussionDisabled = false,
      showTime,
      showReactionBar = true,
      isSendBySpaceMember = false,
      isDraw = false,
      isEditing = false,
      isDiscussion = false,
      ...props
    },
    ref,
  ) => {
    const isMe = sender === 'me' || isSendBySpaceMember;
    const { t } = useTranslation('common');
    const isPending = message.status === 'pending';
    const mediaLength = message.media?.length || 0;
    const { isOnHelpDeskChat } = useBusinessNavigationData();
    const isSystemMessage = message.type === 'action';
    const { value: isActive, setValue: setActive } = useBoolean(false);
    const {
      value: showDetail,
      setValue: setShowDetail,
      toggle: toggleShowDetail,
      setFalse: hideDetail,
    } = useBoolean(false);

    const actionsFromScriptChat = message.actions;
    return (
      <MessageItemContext.Provider
        value={{
          isMe,
          isPending,
          message,
          setActive,
        }}
      >
        {!isDraw && <SeenTracker guestId={guestId} />}
        {isSystemMessage ? (
          <MessageItemSystem message={message} isMe={isMe} />
        ) : (
          <>
            {direction === 'bottom' && !isOnHelpDeskChat && (
              <ReadByUsers
                roomId={message.room?._id}
                readByUsers={readByUsers}
                isMe={isMe}
              />
            )}
            <div
              className={cn(
                `group relative flex flex-col`,
                isActive && 'opacity-0',
              )}
            >
              {isEditing && (
                <div className="flex justify-end gap-2 text-xs text-neutral-800">
                  <PenLineIcon size={16} /> <span>{t('COMMON.EDITING')}</span>
                </div>
              )}
              <div
                className={cn(
                  'relative flex',
                  isMe ? 'justify-end' : '',
                  isPending && 'opacity-50',
                )}
              >
                {isMe && (
                  <div className="pointer-events-none w-11 shrink-0 md:w-20" />
                )}
                {showAvatar ? (
                  <Avatar
                    className="pointer-events-auto mb-auto mr-1  mt-0.5 shrink-0"
                    src={
                      spaceAvatar ||
                      message.sender.avatar ||
                      '/anonymous_avt.png'
                    }
                    alt={message.sender.name}
                    size="xs"
                  />
                ) : (
                  <div
                    className={cn(
                      'pointer-events-none mb-0.5 mr-1 mt-auto size-6 shrink-0',
                      isDraw ? 'hidden' : 'block',
                    )}
                  />
                )}
                <MessageItemWrapper
                  hideDetail={hideDetail}
                  showDetail={showDetail}
                  toggleDetail={toggleShowDetail}
                  showTime={showTime}
                  actionsDisabled={actionsDisabled || isEditing}
                  reactionDisabled
                  discussionDisabled={discussionDisabled}
                  setActive={setActive}
                  isMe={isMe}
                  message={message}
                >
                  <div {...props} ref={ref} className={className}>
                    <div
                      className={cn(
                        messageVariants({
                          sender,
                          order,
                          status: message.status,
                        }),
                        'text-content-wrapper pointer-events-auto',
                        mediaLength > 1 && 'rounded-none',
                      )}
                    >
                      {message.content && (
                        <Content
                          showDetails={showDetail}
                          position={isMe ? 'right' : 'left'}
                          message={message}
                          active={isActive}
                          isEditing={isEditing}
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

                    <div className="block-blur absolute bottom-0 left-0  hidden h-9 w-full bg-gradient-to-t from-gray2 to-gray2/0" />
                  </div>
                </MessageItemWrapper>
                {!isMe && (
                  <div className="pointer-events-none w-11 shrink-0 md:w-20" />
                )}
              </div>
              <AnimatePresence>
                {isPending && <PendingStatus />}
              </AnimatePresence>
              <div className={cn(!isMe ? 'pl-7' : '')}>
                {message?.content && (
                  <MessageItemLinks isMe={isMe} message={message} />
                )}

                {message.forwardOf && !actionsDisabled && (
                  <MessageItemForward
                    hasParent={!!message.content}
                    message={message.forwardOf}
                    isMe={isMe}
                  />
                )}

                {pinnedBy && !actionsDisabled && (
                  <MessageItemPinned pinnedBy={pinnedBy} isMe={isMe} />
                )}
                {!discussionDisabled && message.hasChild && showReply && (
                  <MessageItemReply isMe={isMe} messageId={message._id} />
                )}
                {showReactionBar &&
                  !reactionDisabled &&
                  message?.reactions &&
                  message.reactions.length > 0 && (
                    <MessageItemReactionBar isMe={isMe} message={message} />
                  )}
              </div>
              <MessageItemParticipantJoinCall message={message} isMe={isMe} />

              {isSendBySpaceMember && isLast && (
                <span
                  className={cn(
                    'mt-1  block text-xs font-light text-neutral-500 dark:text-neutral-200',
                    isMe ? 'text-end' : 'pl-7 text-start',
                  )}
                >
                  {t('COMMON.SEND_BY')}&nbsp;
                  <span className="font-medium">
                    {message.sender?.name}
                    {message.senderType === 'bot' && <>&apos;s script</>}
                  </span>
                </span>
              )}
              <MessageItemFlowActions actions={actionsFromScriptChat || []} />
            </div>
            {direction === 'top' && (
              <ReadByUsers
                isDiscussion={isDiscussion}
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
