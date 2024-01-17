import { Button } from '@/components/actions';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useAuthStore } from '@/stores/auth.store';
import { PhoneCallIcon } from 'lucide-react';
import { useChatBox } from '../../contexts';
import { useEffect, useState } from 'react';
import { checkRoomIsHaveMeetingService } from '@/services/call.servide';
import { Room } from '../../types';
import { STATUS } from '@/features/call/constant/status';

export interface RoomItemComingCallProps {
  roomChatBox: Room;
}

export const RoomItemComingCall = ({
  roomChatBox,
}: RoomItemComingCallProps) => {
  const { user } = useAuthStore();
  const { setRoom, room, setTempRoom } = useVideoCallStore();
  const [isHaveMeeting, setHaveMeeting] = useState(false);
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
    <div>
      {isHaveMeeting && (
        <Button.Icon size="xs">
          <PhoneCallIcon />
        </Button.Icon>
      )}
    </div>
  );
};
