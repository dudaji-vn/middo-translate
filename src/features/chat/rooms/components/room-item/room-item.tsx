import { createContext, forwardRef, memo, useContext, useMemo } from 'react';

import { ItemAvatar } from './room-item.avatar';
import { ItemSub } from './room-item.sub';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';
import { RoomItemHead } from './room-item.head';
import { RoomItemWrapper } from './room-item.wrapper';
import { User } from '@/features/users/types';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';

export interface RoomItemProps {
  data: Room;
  isActive?: boolean;
  isRead: boolean;
  currentUser: User;
  currentRoomId?: Room['_id'];
  showMembersName?: boolean;
  showTime?: boolean;
  onClick?: () => void;
}

const RoomItemContext = createContext<RoomItemProps>({} as RoomItemProps);

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

  const room = useMemo(
    () => generateRoomDisplay(_data, currentUserId),
    [_data, currentUserId],
  );
  const isRead = room?.lastMessage?.readBy?.includes(currentUserId) || false;

  const isActive =
    room.link === `/${ROUTE_NAMES.ONLINE_CONVERSATION}/${currentRoomId}` ||
    _isActive;

  return (
    <RoomItemContext.Provider
      value={{
        isRead,
        data: room,
        isActive,
        currentUser,
        showMembersName,
        showTime,
        onClick,
      }}
    >
      <RoomItemWrapper>
        <ItemAvatar room={room} />
        <div className="w-full">
          <RoomItemHead
            isRead={isRead}
            showTime={showTime}
            time={room.lastMessage?.createdAt || room.newMessageAt}
            name={room.name}
          />
          {showMembersName && (
            <div className="flex items-center">
              <span className="line-clamp-1 break-all text-sm text-text/50">
                {room.participants.map((user) => user.name).join(', ')}
              </span>
            </div>
          )}
          {room.lastMessage && !showMembersName && (
            <ItemSub
              currentUser={currentUser}
              isGroup={room.isGroup}
              message={room.lastMessage}
              participants={room.participants}
            />
          )}
        </div>
      </RoomItemWrapper>
    </RoomItemContext.Provider>
  );
});

RoomItem.displayName = 'RoomItem';

export const MemoizedRoomItem = memo(RoomItem);

export const useRoomItem = () => {
  const context = useContext(RoomItemContext);
  if (!context) {
    throw new Error('useRoomItem must be used within RoomItemContext');
  }
  return context;
};
