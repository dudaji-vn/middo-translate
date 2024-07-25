'use client';

import { useEffect, useMemo, useState } from 'react';

import { InfiniteScroll } from '@/components/infinity-scroll';
import { Room } from '../../../rooms/types';
import { Message } from '../../types';
import { MessageItemGroup } from '../message-group';
import { MessageItem } from '../message-item';

import { useAuthStore } from '@/stores/auth.store';
import moment from 'moment';

import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useSetParams } from '@/hooks/use-set-params';
import { cn } from '@/utils/cn';
import { useMessageActions } from '../message-actions';
import { MessageBoxSearch } from '../message-box-search';
import { TimeDisplay } from '../time-display';
import {
  generateUsersReadMessageMap,
  groupMessages,
} from './message-box-utils';
import { useMessagesBox } from './messages-box.context';
import { ScrollToButton } from './scroll-to-button';
import { useMessageBoxScroll } from './use-message-box-scroll';
import { MessageBoxNewSection } from './message-box-new-section';
export const MAX_TIME_DIFF = 5; // 5 minutes
export const MAX_TIME_GROUP_DIFF = 30; // 1 day
export type MessageGroup = {
  messages: Message[];
  lastMessage: Message;
};
export const MessageBox = ({
  room,
  isAnonymous,
  guestId,
}: {
  room: Room;
  isAnonymous?: boolean;
  guestId?: string;
}) => {
  const [lastUnreadMessageId, setLastUnreadMessageId] = useState<string | null>(
    null,
  );

  const currentUserId = useAuthStore((s) => s.user?._id || guestId);
  const {
    hasNextPage,
    loadMoreMessages,
    messages,
    pinnedMessages,
    isInitialLoading,
  } = useMessagesBox();
  const { searchParams } = useSetParams();
  const {
    bottomRef,
    handleScrollToBottom,
    isShowScrollToBottom,
    ref,
    setIsShowScrollToBottom,
  } = useMessageBoxScroll();
  const messageId = searchParams?.get('search_id');
  const { isOnBusinessChat } = useBusinessNavigationData();
  const { message: messageEditing, action } = useMessageActions();

  const [isViewUnread, setIsViewUnread] = useState(false);

  const [participants, setParticipants] = useState(room.participants);

  useEffect(() => {
    setParticipants(room.participants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.participants.length]);

  useEffect(() => {
    if (lastUnreadMessageId || !currentUserId) return;
    let id = null;
    messages.forEach((message) => {
      if (!message.readBy?.includes(currentUserId)) {
        id = message._id;
      }
    });
    setLastUnreadMessageId(id);
  }, [currentUserId, lastUnreadMessageId, messages]);

  const messagesGroup = useMemo(() => {
    return groupMessages(messages, [lastUnreadMessageId || '']);
  }, [messages, lastUnreadMessageId]);

  const usersReadMessageMap = useMemo(() => {
    return generateUsersReadMessageMap(
      messagesGroup,
      participants,
      currentUserId as string,
    );
  }, [currentUserId, messagesGroup, participants]);

  return (
    <div className={cn('relative flex h-full w-full flex-1 overflow-hidden')}>
      {!messageId && (
        <InfiniteScroll
          scrollDirection="to-top"
          hasMore={hasNextPage || false}
          onLoadMore={loadMoreMessages}
          ref={ref}
          id="inbox-list"
          className="bg-primary/5 flex w-full flex-1 flex-col-reverse gap-2.5 overflow-x-hidden overflow-y-scroll px-2 md:px-3"
        >
          <div ref={bottomRef} className="h-[0.1px] w-[0.1px]" />

          {messagesGroup.map((group, index) => {
            const isSendBySpaceMember = Boolean(
              isOnBusinessChat && group.lastMessage.senderType !== 'anonymous',
            );
            const timeDiff = moment(moment(group.lastMessage.createdAt)).diff(
              messagesGroup[index + 1]?.messages[0].createdAt ?? moment(),
              'minute',
            );
            const isShowTimeGroup = timeDiff > MAX_TIME_GROUP_DIFF;
            const isMe =
              (group.lastMessage.sender?._id === currentUserId &&
                currentUserId) ||
              isSendBySpaceMember;
            const isSystem =
              group.lastMessage.type === 'notification' ||
              group.lastMessage.type === 'action';

            return (
              <div
                key={group.lastMessage.clientTempId || group.lastMessage._id}
              >
                {lastUnreadMessageId === group.lastMessage._id &&
                  !isInitialLoading && (
                    <MessageBoxNewSection
                      onIntersected={() => setIsViewUnread(true)}
                    />
                  )}
                {isShowTimeGroup && (
                  <TimeDisplay time={group.lastMessage.createdAt} />
                )}
                {!isSystem && (
                  <div
                    className={cn(
                      'flex items-center gap-2 pl-7',
                      isMe ? 'justify-end' : '',
                    )}
                  >
                    {!isMe && room.isGroup && (
                      <div className="break-word-mt mb-0.5 text-xs font-medium text-neutral-600">
                        <span>{group.lastMessage.sender.name}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex w-full gap-1">
                  <MessageItemGroup>
                    {group.messages.map((message, index) => {
                      const isLast = index === 0;
                      const pinnedBy = pinnedMessages?.find(
                        (pinnedMessage) =>
                          pinnedMessage.message._id === message._id,
                      )?.pinnedBy;
                      const newMessage = {
                        ...message,
                        isPinned: !!pinnedBy,
                      };
                      return (
                        <MessageItem
                          seenTrackerDisabled={
                            !!lastUnreadMessageId && !isViewUnread
                          }
                          isEditing={
                            message._id === messageEditing?._id &&
                            action === 'edit'
                          }
                          isLast={isLast}
                          reactionDisabled={room.isHelpDesk || isAnonymous}
                          guestId={guestId}
                          pinnedBy={pinnedBy}
                          showAvatar={
                            !isSendBySpaceMember &&
                            !isMe &&
                            !isSystem &&
                            message._id === group.lastMessage._id
                          }
                          spaceAvatar={
                            isAnonymous ? room.space?.avatar : undefined
                          }
                          isSendBySpaceMember={isSendBySpaceMember}
                          key={message?.clientTempId || message._id}
                          message={newMessage}
                          sender={isMe ? 'me' : 'other'}
                          readByUsers={usersReadMessageMap[message._id] ?? []}
                        />
                      );
                    })}
                  </MessageItemGroup>
                </div>
              </div>
            );
          })}
          {!hasNextPage && (
            <TimeDisplay
              time={
                messagesGroup[messagesGroup.length - 1]?.messages[0].createdAt
              }
            />
          )}
        </InfiniteScroll>
      )}
      {messageId && (
        <MessageBoxSearch
          setIsShowScrollToBottom={setIsShowScrollToBottom}
          pinnedMessages={pinnedMessages}
          isAnonymous={isAnonymous}
          guestId={guestId}
          room={room}
          messageId={messageId}
        />
      )}
      {isShowScrollToBottom && (
        <ScrollToButton
          roomId={room._id}
          handleScrollToBottom={handleScrollToBottom}
        />
      )}
    </div>
  );
};
