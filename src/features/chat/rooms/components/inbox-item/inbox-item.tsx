import { forwardRef, memo, useMemo } from 'react';

import { InboxItemMenu } from './inbox-item-menu';
import { ItemAvatar } from './inbox-item-avatar';
import { ItemSub } from './inbox-item-sub';
import Link from 'next/link';
import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import moment from 'moment';

export interface InboxItemProps {
  data: Room;
  isActive?: boolean;
  currentUserId: User['_id'];
  currentRoomId?: Room['_id'];
  showMembersName?: boolean;
  showTime?: boolean;
  onClick?: () => void;
}
const InboxItem = forwardRef<HTMLDivElement, InboxItemProps>(
  (
    {
      data: _data,
      isActive,
      currentUserId,
      showMembersName,
      currentRoomId,
      showTime = true,
      onClick,
    },
    ref,
  ) => {
    const data = useMemo(
      () => generateRoomDisplay(_data, currentUserId),
      [_data, currentUserId],
    );

    const time = useMemo(() => {
      if (data.newMessageAt) {
        return moment(data.newMessageAt).fromNow(true);
      }
      return '';
    }, [data.newMessageAt]);
    const isRead = data?.lastMessage?.readBy?.includes(currentUserId);

    return (
      <Link onClick={onClick} href={data.link!}>
        <div
          ref={ref}
          className={cn(
            'group relative flex cursor-pointer items-center justify-between p-3 transition-all',
            data.link === `/talk/${currentRoomId}` || isActive
              ? 'bg-background-darker'
              : 'bg-transparent hover:bg-[#fafafa]',
          )}
        >
          <div className="flex w-full items-center gap-3">
            <ItemAvatar room={data} />
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <div className="max-w-full">
                  <span
                    className={cn(
                      'line-clamp-1 break-all ',
                      isRead ? 'font-normal' : 'font-semibold',
                    )}
                  >
                    {data.name}
                  </span>
                </div>
                {data.newMessageAt && showTime && (
                  <span className="ml-auto shrink-0 pl-2 font-light">
                    {time}
                  </span>
                )}
              </div>
              {showMembersName && (
                <div className="flex items-center">
                  <span className="line-clamp-1 break-all text-sm text-text/50">
                    {data.participants.map((user) => user.name).join(', ')}
                  </span>
                </div>
              )}
              {data.lastMessage && !showMembersName && (
                <ItemSub
                  message={data.lastMessage}
                  participants={data.participants}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
            <InboxItemMenu room={data} />
          </div>
        </div>
      </Link>
    );
  },
);

InboxItem.displayName = 'InboxItem';

export const MemoizedInboxItem = memo(InboxItem);
