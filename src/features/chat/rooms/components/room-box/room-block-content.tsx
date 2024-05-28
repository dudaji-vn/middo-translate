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
  const { t } = useTranslation();
  const { mutate } = useUnBlockUser();
  const currentUser = useAuthStore((state) => state.user);
  const user = room.participants
    .concat(room.waitingUsers || [])
    .find((participant) => participant._id !== currentUser?._id) as User;
  const handleUnblock = () => {
    mutate(user._id);
  };
  return (
    <div className="relative flex flex-col items-center gap-2 py-1">
      <span className="font-semibold text-error md:text-sm">
        You have blocked {user?.name}
      </span>
      <span className="text-neutral-600 md:text-sm">
        You will not receive any message or call from them.
      </span>
      <Button
        onClick={handleUnblock}
        shape="square"
        color="default"
        size="xs"
        className="my-5"
        startIcon={<UnlockIcon />}
      >
        Unblock
      </Button>
    </div>
  );
};
