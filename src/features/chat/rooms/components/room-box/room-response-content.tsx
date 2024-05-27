'use client';
import { useTranslation } from 'react-i18next';
import { Room } from '../../types';
import { Button } from '@/components/actions';
import { BanIcon, TrashIcon } from 'lucide-react';

export interface RoomResponseContentProps {
  room: Room;
}

export const RoomResponseContent = ({ room }: RoomResponseContentProps) => {
  const { t } = useTranslation();
  return (
    <div className=" relative flex w-full flex-col items-center gap-2">
      <span className="font-semibold text-primary md:text-sm">
        Sun isn’t in your contacts yet.
      </span>
      <div className="prose my-0 text-center text-sm text-neutral-600">
        <li>
          <strong>Reply</strong> to add them in your contacts.
        </li>
        <li>
          <strong>Delete</strong> messages if you do not recognize them.
        </li>
        <li>
          <strong>Block</strong> if you think it’s a spam or scam.
        </li>
      </div>
      <div className="my-5 flex gap-5">
        <Button
          shape="square"
          color="default"
          size="xs"
          startIcon={<TrashIcon />}
        >
          Delete
        </Button>
        <Button shape="square" color="error" size="xs" startIcon={<BanIcon />}>
          Block
        </Button>
      </div>
    </div>
  );
};
