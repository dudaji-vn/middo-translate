import { RoomItemTime } from './room-item-time';
import { cn } from '@/utils/cn';
import { useRoomItem } from './room-item';
import RoomItemTag from './room-item-tag';

export interface RoomItemHeadProps {
  name?: string;
  isRead?: boolean;
  showTime?: boolean;
  time?: string;
  rightElement?: React.ReactNode;
}

export const RoomItemHead = ({ isRead, showTime, time }: RoomItemHeadProps) => {
  const { data } = useRoomItem();
  return (
    <div className="mb-1 flex items-center justify-between">
      <div className="flex w-full max-w-full flex-row items-center gap-2">
        <RoomItemTag tag={data.tag} />
        <span
          className={cn(
            'line-clamp-1 break-all ',
            isRead ? 'font-normal' : 'font-semibold',
          )}
        >
          {data.name}
        </span>
      </div>
      {time && showTime && (
        <RoomItemTime
          date={time}
          className="ml-2 text-xs font-light text-neutral-500 dark:text-neutral-200"
        />
      )}
    </div>
  );
};
