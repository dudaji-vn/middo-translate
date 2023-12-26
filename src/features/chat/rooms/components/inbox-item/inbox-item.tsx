import { createContext, forwardRef, memo, useContext, useMemo } from 'react';

import { InboxItemHead } from './inbox-item.head';
import { InboxItemWrapper } from './inbox-item.wrapper';
import { ItemAvatar } from './inbox-item.avatar';
import { ItemSub } from './inbox-item.sub';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import moment from 'moment';

export interface InboxItemProps {
  data: Room;
  isActive?: boolean;
  currentUser: User;
  currentRoomId?: Room['_id'];
  showMembersName?: boolean;
  showTime?: boolean;
  onClick?: () => void;
}

const InboxItemContext = createContext<InboxItemProps>({} as InboxItemProps);
export const useInboxItem = () => {
  const context = useContext(InboxItemContext);
  if (!context) {
    throw new Error('useInboxItem must be used within InboxItemContext');
  }
  return context;
};
const InboxItem = forwardRef<HTMLDivElement, InboxItemProps>((props, ref) => {
  const {
    data: _data,
    isActive: _isActive,
    currentUser,
    showMembersName,
    currentRoomId,
    showTime = true,
    onClick,
  } = props;
  const currentUserId = currentUser?._id;

  const data = useMemo(
    () => generateRoomDisplay(_data, currentUserId),
    [_data, currentUserId],
  );

  const time = useMemo(() => {
    const dateString = data.lastMessage?.createdAt || data.createdAt;
    if (dateString) {
      if (moment(dateString).isSame(moment(), 'day')) {
        return moment(dateString).format('HH:mm A');
      } else {
        return moment(dateString).format('YYYY/MM/DD');
      }
    }

    return '';
  }, [data.createdAt, data.lastMessage?.createdAt]);
  const isRead = data?.lastMessage?.readBy?.includes(currentUserId);
  const isActive =
    data.link === `/${ROUTE_NAMES.ONLINE_CONVERSATION}/${currentRoomId}` ||
    _isActive;

  return (
    <InboxItemContext.Provider
      value={{
        data,
        isActive,
        currentUser,
        showMembersName,
        showTime,
        onClick,
      }}
    >
      <InboxItemWrapper>
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
      </InboxItemWrapper>
    </InboxItemContext.Provider>
  );
});

InboxItem.displayName = 'InboxItem';

export const MemoizedInboxItem = memo(InboxItem);
