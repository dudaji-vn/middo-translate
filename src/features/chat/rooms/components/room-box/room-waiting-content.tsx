'use client';
import { Room } from '../../types';
import { useAuthStore } from '@/stores/auth.store';

export interface RoomWaitingContentProps {
  room: Room;
}

export const RoomWaitingContent = ({ room }: RoomWaitingContentProps) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  let otherUser = room?.waitingUsers?.find(
    (user) => user._id !== currentUserId,
  );
  if(!otherUser) {
    otherUser = room?.participants?.find(
      (user) => user._id !== currentUserId,
    )
  }
  return (
    <div className="prose relative mx-auto flex w-full flex-col items-center gap-2 py-1 pb-3 dark:bg-background">
      <span className="font-semibold text-primary md:text-sm">
        {otherUser?.name}&nbsp;isn’t in your contacts yet.
      </span>
      <span className="text-center font-light text-neutral-600 md:text-sm dark:text-neutral-50">
        You will be not able to:
      </span>
      <ul className="my-0 text-neutral-600 dark:text-neutral-50 md:text-sm">
        <li>See their online status</li>
        <li>Call them</li>
        <li>Send media/files</li>
      </ul>
      <span className="text-center font-light text-neutral-600 md:text-sm dark:text-neutral-50">
        Until they accept your messages.
      </span>
    </div>
  );
};
