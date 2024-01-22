import { Button } from '@/components/actions';
import { PhoneCallIcon } from 'lucide-react';
import { useCheckHaveMeeting } from '../../hooks/use-check-have-meeting';
import { useJoinCall } from '../../hooks/use-join-call';
import { Room } from '../../types';

export interface RoomItemComingCallProps {
  roomChatBox: Room;
}

export const RoomItemComingCall = ({
  roomChatBox,
}: RoomItemComingCallProps) => {
  const isHaveMeeting = useCheckHaveMeeting(roomChatBox?._id);
  const startVideoCall = useJoinCall();
  if (!isHaveMeeting) return null;
  return (
    <div className="flex items-center pr-3">
      <Button.Icon onClick={() => startVideoCall(roomChatBox._id)} size="xs">
        <PhoneCallIcon />
      </Button.Icon>
    </div>
  );
};
