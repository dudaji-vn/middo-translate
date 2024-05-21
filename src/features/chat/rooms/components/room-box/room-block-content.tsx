'use client';

import { Button } from '@/components/actions';
import { User } from '@/features/users/types';
import { UnlockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Room } from '../../types';

export interface RoomBlockContentProps {
  room: Room;
}

export const RoomBlockContent = ({ room }: RoomBlockContentProps) => {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col items-center gap-2 py-1">
      <span className="font-semibold text-error md:text-sm">
        You have blocked Sun
      </span>
      <span className="text-neutral-600 md:text-sm">
        You will not receive any message or call from them.
      </span>
      <Button
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
