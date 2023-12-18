import { LogOut, Trash } from 'lucide-react';
import { forwardRef, memo, useMemo } from 'react';

import { Button } from '@/components/actions';
import { InboxItemHead } from './inbox-item-head';
import { InboxItemMenu } from './inbox-item-menu';
import { InboxItemMobileWrapper } from './inbox-item-mobile-wrapper';
import { ItemAvatar } from './inbox-item-avatar';
import { ItemSub } from './inbox-item-sub';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import moment from 'moment';
import { useBoolean } from 'usehooks-ts';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useLongPress } from 'use-long-press';

export interface InboxItemProps {
  data: Room;
  isActive?: boolean;
  currentUser: User;
  currentRoomId?: Room['_id'];
  showMembersName?: boolean;
  showTime?: boolean;
  onClick?: () => void;
}
const InboxItem = forwardRef<HTMLDivElement, InboxItemProps>(
  (
    {
      data: _data,
      isActive: _isActive,
      currentUser,
      showMembersName,
      currentRoomId,
      showTime = true,
      onClick,
    },
    ref,
  ) => {
    const currentUserId = currentUser?._id;
    const isMobile = useIsMobile();

    const data = useMemo(
      () => generateRoomDisplay(_data, currentUserId),
      [_data, currentUserId],
    );

    const time = useMemo(() => {
      if (data.newMessageAt) {
        // if last message is today
        if (moment(data.newMessageAt).isSame(moment(), 'day')) {
          return moment(data.newMessageAt).format('HH:mm A');
        } else {
          return moment(data.newMessageAt).format('YYYY/MM/DD');
        }
      }

      return '';
    }, [data.newMessageAt]);
    const isRead = data?.lastMessage?.readBy?.includes(currentUserId);
    const isActive =
      data.link === `/${ROUTE_NAMES.ONLINE_CONVERSATION}/${currentRoomId}` ||
      _isActive;

    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex cursor-pointer items-center justify-between p-3 transition-all',
          isActive
            ? 'bg-background-darker'
            : 'bg-transparent hover:bg-[#fafafa]',
        )}
      >
        {isMobile ? (
          <InboxItemMobileWrapper>
            <div onClick={onClick} className="flex w-full items-center gap-3">
              <ItemAvatar room={data} />
              <div className="w-full">
                <InboxItemHead
                  name={data.name}
                  isRead={isRead}
                  showTime={showTime}
                  time={time}
                />
                {showMembersName && (
                  <div className="flex items-center">
                    <span className="line-clamp-1 break-all text-sm text-text/50">
                      {data.participants.map((user) => user.name).join(', ')}
                    </span>
                  </div>
                )}
                {data.lastMessage && !showMembersName && (
                  <ItemSub
                    currentUser={currentUser}
                    isGroup={data.isGroup}
                    message={data.lastMessage}
                    participants={data.participants}
                  />
                )}
              </div>
            </div>
          </InboxItemMobileWrapper>
        ) : (
          <>
            <Link
              onClick={onClick}
              href={data.link!}
              className="flex w-full items-center gap-3"
            >
              <ItemAvatar room={data} />
              <div className="w-full">
                <InboxItemHead
                  name={data.name}
                  isRead={isRead}
                  showTime={showTime}
                  time={time}
                />
                {showMembersName && (
                  <div className="flex items-center">
                    <span className="line-clamp-1 break-all text-sm text-text/50">
                      {data.participants.map((user) => user.name).join(', ')}
                    </span>
                  </div>
                )}
                {data.lastMessage && !showMembersName && (
                  <ItemSub
                    currentUser={currentUser}
                    isGroup={data.isGroup}
                    message={data.lastMessage}
                    participants={data.participants}
                  />
                )}
              </div>
            </Link>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
              <InboxItemMenu room={data} />
            </div>
          </>
        )}
      </div>
    );
  },
);

InboxItem.displayName = 'InboxItem';

export const MemoizedInboxItem = memo(InboxItem);
