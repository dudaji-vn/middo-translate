import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';
import { useRoomItem } from './room-item';

export interface RoomItemWrapperProps {
  isBusinessRoom?: boolean;
}

export const RoomItemWrapper = ({
  isBusinessRoom,
  ...props
}: RoomItemWrapperProps & PropsWithChildren) => {
  const { data, isActive, onClick, disabledRedirect } = useRoomItem();

  return (
    <div
      className={cn(
        'relative flex flex-1 cursor-pointer items-center justify-between px-3 py-2 transition-all',
        isActive ? 'bg-primary-200' : 'bg-transparent hover:bg-primary-100',
      )}
    >
      {disabledRedirect ? (
        <div onClick={onClick} className="flex w-full items-center gap-3">
          {props.children}
        </div>
      ) : (
        <Link
          onClick={onClick}
          href={data.link || ''}
          className="flex w-full items-center gap-3"
        >
          {props.children}
        </Link>
      )}
    </div>
  );
};
