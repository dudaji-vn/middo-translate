import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';
import { useRoomItem } from './room-item';

export interface RoomItemWrapperProps {}

export const RoomItemWrapper = (
  props: RoomItemWrapperProps & PropsWithChildren,
) => {
  const { data, isActive, onClick } = useRoomItem();

  return (
    <div
      className={cn(
        'relative flex cursor-pointer items-center justify-between px-3 py-2 transition-all',
        isActive ? 'bg-background-darker' : 'bg-transparent hover:bg-[#fafafa]',
      )}
    >
      <Link
        onClick={onClick}
        href={data.link || ''}
        className="flex w-full items-center gap-3"
      >
        {props.children}
      </Link>
    </div>
  );
};
