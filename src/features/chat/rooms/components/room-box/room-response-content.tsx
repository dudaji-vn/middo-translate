'use client';
import { useTranslation } from 'react-i18next';
import { Room } from '../../types';
import { Button } from '@/components/actions';
import {
  BanIcon,
  CheckCircle2Icon,
  TrashIcon,
  XCircleIcon,
} from 'lucide-react';
import { useRoomActions } from '../room-actions';
import { useAuthStore } from '@/stores/auth.store';
import { User } from '@/features/users/types';

export interface RoomResponseContentProps {
  room: Room;
}

export const RoomResponseContent = ({ room }: RoomResponseContentProps) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const user = room.participants
    .concat(room.waitingUsers || [])
    .find((participant) => participant._id !== currentUserId) as User;
  const { t } = useTranslation('common');
  const { onAction } = useRoomActions();
  if (room.isGroup) {
    return (
      <div className="relative mt-60 flex w-full flex-col items-center gap-2">
        <span className="font-semibold text-primary md:text-sm">
          You are invited to join the group.
        </span>
        <div className="prose my-0 text-center text-sm text-neutral-600">
          <li>
            <strong>Reject</strong> to ignore the invitation.
          </li>
          <li>
            <strong>Accept</strong> to join the group.
          </li>
        </div>
        <div className="my-5 mt-3 flex gap-5">
          <Button
            onClick={() =>
              onAction({
                action: 'reject',
                room: room,
              })
            }
            shape="square"
            color="default"
            size="xs"
            startIcon={<XCircleIcon />}
          >
            {t('COMMON.REJECT')}
          </Button>
          <Button
            onClick={() =>
              onAction({
                action: 'accept',
                room: room,
              })
            }
            shape="square"
            size="xs"
            startIcon={<CheckCircle2Icon />}
          >
            {t('COMMON.ACCEPT')}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className=" relative flex w-full flex-col items-center gap-2">
      <span className="font-semibold text-primary md:text-sm">
        {user?.name}
        isn’t in your contacts yet.
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
          onClick={() =>
            onAction({
              action: 'delete',
              room: room,
            })
          }
          shape="square"
          color="default"
          size="xs"
          startIcon={<TrashIcon />}
        >
          Delete
        </Button>
        <Button
          onClick={() =>
            onAction({
              action: 'block',
              room: room,
            })
          }
          shape="square"
          color="error"
          size="xs"
          startIcon={<BanIcon />}
        >
          Block
        </Button>
      </div>
    </div>
  );
};
