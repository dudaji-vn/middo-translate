'use client';
import { useTranslation } from 'react-i18next';
import { Room } from '../../types';

export interface RoomWaitingContentProps {
  room: Room;
}

export const RoomWaitingContent = ({ room }: RoomWaitingContentProps) => {
  const { t } = useTranslation();
  return (
    <div className="prose relative flex flex-col items-center gap-2 py-1">
      <span className="font-semibold text-primary md:text-sm">
        Sun isn’t in your contacts yet.
      </span>
      <span className="text-center font-light text-neutral-600 md:text-sm">
        You will be not able to:
      </span>
      <ul className="my-0 text-neutral-600">
        <li>See their online status</li>
        <li>Call them</li>
        <li>Send media/files</li>
      </ul>
      <span className="font-light">Until they accept your messages.</span>
    </div>
  );
};
