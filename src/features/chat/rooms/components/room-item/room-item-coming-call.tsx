import { Button } from '@/components/actions';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useAuthStore } from '@/stores/auth.store';
import { PhoneCallIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { checkRoomIsHaveMeetingService } from '@/services/call.servide';
import { Room } from '../../types';
import { STATUS } from '@/features/call/constant/status';
import { joinVideoCallRoom } from '@/services/video-call.service';
import { CALL_TYPE, JOIN_TYPE } from '@/features/call/constant/call-type';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useCheckHaveMeeting } from '../../hooks/use-check-have-meeting';
import { useJoinCall } from '../../hooks/use-join-call';
import { useChatBox } from '../../contexts';

export interface RoomItemComingCallProps {
  roomChatBox: Room;
}

export const RoomItemComingCall = ({
  roomChatBox,
}: RoomItemComingCallProps) => {
  const isHaveMeeting = useCheckHaveMeeting(roomChatBox?._id)
  const startVideoCall = useJoinCall()
  if (!isHaveMeeting) return null;
  return (
    <div className="flex items-center pr-3">
      <Button.Icon onClick={() => startVideoCall(roomChatBox._id)} size="xs">
        <PhoneCallIcon />
      </Button.Icon>
    </div>
  );
};
