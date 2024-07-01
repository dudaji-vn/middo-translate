import { Button } from '@/components/actions';
import { PhoneCallIcon } from 'lucide-react';
import { useCheckHaveMeeting } from '../../hooks/use-check-have-meeting';
import { useJoinCall } from '../../hooks/use-join-call';
import { Room } from '../../types';
import { useTranslation } from 'react-i18next';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

export interface RoomItemComingCallProps {
  roomChatBox: Room;
}

export const RoomItemComingCall = ({
  roomChatBox,
}: RoomItemComingCallProps) => {
  const startVideoCall = useJoinCall();
  const {isBusiness} = useBusinessNavigationData();
  const isHaveMeeting = useCheckHaveMeeting(roomChatBox?._id, isBusiness);
  const {t} = useTranslation('common');
  if (!isHaveMeeting) return null;
  if(isBusiness && !isHaveMeeting) return null;
  return (
    <div className="line-clamp-1 flex shrink-0 items-center pr-3 h-full">
      <Button
        startIcon={<PhoneCallIcon />}
        onClick={() => startVideoCall({ roomId: roomChatBox._id})}
        size="xs"
        shape="square"
        className='whitespace-nowrap'
      >
        {t('CONVERSATION.JOIN')}
      </Button>
    </div>
  );
};
