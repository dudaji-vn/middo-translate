import { Button } from '@/components/actions';
import { PhoneCallIcon } from 'lucide-react';
import { useCheckHaveMeeting } from '../../hooks/use-check-have-meeting';
import { useJoinCall } from '../../hooks/use-join-call';
import { Room } from '../../types';
import { useTranslation } from 'react-i18next';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';

export interface RoomItemCallProps {
  roomChatBox: Room;
  isForgeShow?: boolean;
}

export const RoomItemCall = ({
  roomChatBox,
  isForgeShow,
}: RoomItemCallProps) => {
  const startVideoCall = useJoinCall();
  const { isBusiness } = useBusinessNavigationData();
  const isHaveMeeting = useCheckHaveMeeting(roomChatBox?._id, isBusiness);
  const { t } = useTranslation('common');

  if (!isHaveMeeting && !isForgeShow) return null;

  return (
    <Tooltip
      title={
        isHaveMeeting ? t('CONVERSATION.JOIN') : t('CONVERSATION.NEW_CALL')
      }
      triggerItem={
        <div className="line-clamp-1 flex h-full shrink-0 items-center pr-3">
          {isHaveMeeting ? (
            <Button
              startIcon={<PhoneCallIcon />}
              onClick={() => startVideoCall({ roomId: roomChatBox._id })}
              size="xs"
              shape="square"
              className="whitespace-nowrap"
            >
              {t('CONVERSATION.JOIN')}
            </Button>
          ) : (
            <Button.Icon
              onClick={() => startVideoCall({ roomId: roomChatBox._id })}
              size="xs"
            >
              <PhoneCallIcon />
            </Button.Icon>
          )}
        </div>
      }
    />
  );
};
