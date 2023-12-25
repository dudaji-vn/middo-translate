'use client';

import { AlertCircleOutline } from '@easy-eva-icons/react';
import { Button } from '@/components/actions';
import { RoomAvatar } from '../../room-avatar.small';
import { RoomBoxHeaderNavigation } from './room-box-header-navigation';
import { generateRoomDisplay } from '../../../utils';
import { useAuthStore } from '@/stores/auth';
import { useChatBox } from '../../../contexts';
import { useMemo } from 'react';

export const ChatBoxHeader = () => {
  const { room: _room } = useChatBox();
  const currentUserId = useAuthStore((s) => s.user?._id) || '';
  const room = useMemo(
    () => generateRoomDisplay(_room, currentUserId),
    [_room, currentUserId],
  );
  return (
    <div className="flex w-full items-center border-b  px-1 py-1 md:px-3">
      <RoomBoxHeaderNavigation />
      <div className="flex items-center gap-2">
        <RoomAvatar isOnline room={room} />
        <div>
          <p className="line-clamp-1 font-medium">{room.name}</p>
          <p className="text-sm font-light">Online</p>
        </div>
      </div>
      <div className="-mr-2 ml-auto">
        <ActionBar />
      </div>
    </div>
  );
};

const ActionBar = () => {
  const { toggleSide, showSide } = useChatBox();
  return (
    <div>
      <Button.Icon
        onClick={toggleSide}
        size="md"
        color={showSide ? 'primary' : 'default'}
        variant="ghost"
      >
        <AlertCircleOutline />
      </Button.Icon>
    </div>
  );
};
