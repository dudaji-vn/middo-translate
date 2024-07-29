import { Item } from '@/components/data-display';
import { BanIcon, UnlockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Room } from '../../types';
import { useRoomActions } from '../room-actions';
import { useCheckRoomRelationship } from '@/features/users/hooks/use-relationship';

export interface RoomBlockProps {
  room: Room;
}

export const RoomBlock = ({ room }: RoomBlockProps) => {
  const { onAction } = useRoomActions();
  const { t } = useTranslation('common');
  const { relationshipStatus } = useCheckRoomRelationship(room);
  if (relationshipStatus === 'me') return null;
  if (relationshipStatus === 'blocking')
    return (
      <Item
        onClick={() => {
          onAction({
            action: 'unblock',
            room: room,
          });
        }}
        leftIcon={<UnlockIcon />}
      >
        {t('COMMON.UNBLOCK')}
      </Item>
    );
  return (
    <Item
      onClick={() => {
        onAction({
          action: 'block',
          room: room,
        });
      }}
      danger
      leftIcon={<BanIcon />}
    >
      {t('COMMON.BLOCK')}
    </Item>
  );
};
