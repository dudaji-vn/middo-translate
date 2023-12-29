import { createContext, forwardRef, memo, useContext, useMemo } from 'react';

import { ItemAvatar } from './room-item.avatar';
import { ItemSub } from './room-item.sub';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';
import { RoomItemHead } from './room-item.head';
import { RoomItemWrapper } from './room-item.wrapper';
import { User } from '@/features/users/types';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import moment from 'moment';

export interface RoomItemProps {
  data: Room;
  isActive?: boolean;
  currentUser: User;
  currentRoomId?: Room['_id'];
  showMembersName?: boolean;
  showTime?: boolean;
  onClick?: () => void;
}

const RoomItemContext = createContext<RoomItemProps>({} as RoomItemProps);
export const useRoomItem = () => {
  const context = useContext(RoomItemContext);
  if (!context) {
    throw new Error('useRoomItem must be used within RoomItemContext');
  }
  return context;
};
const RoomItem = forwardRef<HTMLDivElement, RoomItemProps>((props, ref) => {
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
    <RoomItemContext.Provider
      value={{
        data,
        isActive,
        currentUser,
        showMembersName,
        showTime,
        onClick,
      }}
    >
      <RoomItemWrapper>
        <ItemAvatar room={data} />
        <div className="w-full">
          <RoomItemHead
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
      </RoomItemWrapper>
    </RoomItemContext.Provider>
  );
});

RoomItem.displayName = 'RoomItem';

export const MemoizedRoomItem = memo(RoomItem);
