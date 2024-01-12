'use client';

import { AlertCircleIcon, Phone } from 'lucide-react';
import { Button } from '@/components/actions';
import { RoomAvatar } from '../../room-avatar';
import { RoomBoxHeaderNavigation } from './room-box-header-navigation';
import { STATUS } from '@/features/call/constant/status';
import { Video } from 'lucide-react';
import { generateRoomDisplay } from '../../../utils';
import { joinVideoCallRoom } from '@/services/video-call.service';
import { useAuthStore } from '@/stores/auth.store';
import { useChatBox } from '../../../contexts';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useVideoCallStore } from '@/features/call/store/video-call.store';

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
        <RoomAvatar isOnline room={room} size={36} />
        <div>
          <p className="line-clamp-1 font-medium">{room.name}</p>
          <p className="text-sm font-light">Online</p>
        </div>
      </div>
      <div className="-mr-2 ml-auto mr-3 flex items-center gap-1">
        <VideoCall roomId={room._id} />
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
        size="xs"
        color={showSide ? 'secondary' : 'primary'}
        variant={showSide ? 'default' : 'ghost'}
      >
        <AlertCircleIcon />
      </Button.Icon>
    </div>
  );
};
const VideoCall = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const { setRoom, room, setTempRoom } = useVideoCallStore();
  const startVideoCall = async () => {
    let res = await joinVideoCallRoom({roomId});
    if(res.data.status === STATUS.JOIN_SUCCESS) {
      if(!room) {
        setRoom(res.data?.room)
      } else {
        setTempRoom(res.data?.room)
      }
    } else {
      toast.error('Error when join room');
    }
  };

  return (
    <div>
      <Button.Icon
        onClick={startVideoCall}
        size="xs"
        color="primary"
        variant="ghost"
      >
        <Phone />
      </Button.Icon>
    </div>
  );
};
