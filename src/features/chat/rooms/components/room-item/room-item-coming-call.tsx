import { Button } from '@/components/actions';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useAuthStore } from '@/stores/auth.store';
import { PhoneCallIcon } from 'lucide-react';
import { useChatBox } from '../../contexts';
import { useEffect, useState } from 'react';
import { checkRoomIsHaveMeetingService } from '@/services/call.servide';
import { Room } from '../../types';
import { STATUS } from '@/features/call/constant/status';
import { joinVideoCallRoom } from '@/services/video-call.service';
import { CALL_TYPE, JOIN_TYPE } from '@/features/call/constant/call-type';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';

export interface RoomItemComingCallProps {
  roomChatBox: Room;
}

export const RoomItemComingCall = ({
  roomChatBox,
}: RoomItemComingCallProps) => {
  const { user } = useAuthStore();
  const { setRoom, room, setTempRoom } = useVideoCallStore();
  const [isHaveMeeting, setHaveMeeting] = useState(false);

  const startVideoCall = async (roomId: string) => {
    let res = await joinVideoCallRoom({ roomId });
    const data = res?.data;
    if (room) {
      // If user is in a meeting => set temp room to show modal
      setTempRoom({
        type: data?.type,
        call: data?.call,
        room: data?.room,
      });
    }
    setRoom(data?.call);
    if (
      data.type == JOIN_TYPE.NEW_CALL &&
      data.call.type === CALL_TYPE.DIRECT
    ) {
      // Get participants id except me
      const participants = data?.room?.participants
        .filter((p: any) => p._id !== user?._id)
        .map((p: any) => p._id);
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, {
        users: participants,
        call: data?.call,
        user: user,
      });
    }
  };
  useEffect(() => {
    if (!roomChatBox?._id) return;
    const checkHaveMeeting = async () => {
      let res = await checkRoomIsHaveMeetingService(roomChatBox?._id);
      const data = res.data;
      if (data.status === STATUS.MEETING_STARTED) {
        setHaveMeeting(true);
      } else {
        setHaveMeeting(false);
      }
    };
    checkHaveMeeting();
  }, [room, roomChatBox, room]);
  return (
    <div className="flex items-center pr-3">
      {isHaveMeeting && (
        <Button.Icon onClick={() => startVideoCall(roomChatBox._id)} size="xs">
          <PhoneCallIcon />
        </Button.Icon>
      )}
    </div>
  );
};
