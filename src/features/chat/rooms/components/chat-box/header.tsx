'use client';

import { AlertCircleOutline } from '@easy-eva-icons/react';
import { Button } from '@/components/actions';
import { InboxItemAvatar } from '../inbox-item';
import { Room } from '@/features/chat/rooms/types';
import { Typography } from '@/components/data-display';
import { generateRoomDisplay } from '../../utils';
import useAuthStore from '@/features/auth/stores/use-auth-store';
import { useMemo } from 'react';

export const ChatBoxHeader = ({ room: _room }: { room: Room }) => {
  const currentUserId = useAuthStore((s) => s.user?._id) || '';
  const room = useMemo(
    () => generateRoomDisplay(_room, currentUserId),
    [_room, currentUserId],
  );
  return (
    <div className="flex w-full items-center border-b px-5 py-3">
      <div className="flex items-center gap-2">
        <InboxItemAvatar isOnline room={room} />
        <div>
          <Typography variant="h4">{room.name}</Typography>
        </div>
      </div>
      <div className="-mr-2 ml-auto">
        <ActionBar />
      </div>
    </div>
  );
};

const ActionBar = () => {
  return (
    <div>
      {/* <Button.Icon size="sm" variant="ghost">
        <PhoneIcon />
      </Button.Icon>
      <Button.Icon size="sm" variant="ghost">
        <VideoCameraIcon />
      </Button.Icon> */}
      <Button.Icon size="md" variant="ghost">
        <AlertCircleOutline />
      </Button.Icon>
    </div>
  );
};
