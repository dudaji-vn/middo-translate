'use client';

import { Button } from '@/components/actions';
import { User } from '@/features/users/types';
import { UnlockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Room } from '../../types';
import { useUnBlockUser } from '@/features/users/hooks/use-unblock-user';
import { useAuthStore } from '@/stores/auth.store';

export interface RoomBlockContentProps {
  room: Room;
}

export const RoomBlockContent = ({ room }: RoomBlockContentProps) => {
  const { t } = useTranslation('common');
  const { mutate } = useUnBlockUser();
  const currentUser = useAuthStore((state) => state.user);
  const user = room.participants
    .concat(room.waitingUsers || [])
    .find((participant) => participant._id !== currentUser?._id) as User;
  const handleUnblock = () => {
    mutate(user._id);
  };
  return (
    <div className="relative flex flex-col items-center gap-2 py-1 dark:bg-background">
      <span className="font-semibold text-error md:text-sm">
        {t('CONVERSATION.BLOCK_CONTENT.TITLE')} {user?.name}
      </span>
      <span className="text-neutral-600 md:text-sm dark:text-neutral-50">
        {t('CONVERSATION.BLOCK_CONTENT.DESCRIPTION')}
      </span>
      <Button
        onClick={handleUnblock}
        shape="square"
        color="default"
        size="xs"
        className="my-5"
        startIcon={<UnlockIcon />}
      >
        {t('COMMON.UNBLOCK')}
      </Button>
    </div>
  );
};
