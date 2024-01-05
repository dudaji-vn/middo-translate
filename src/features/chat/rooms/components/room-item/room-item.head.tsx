import { RoomItemTime } from './room-item.time';
import { cn } from '@/utils/cn';
import { useRoomItem } from './room-item';

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
      <div className="max-w-full">
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
        <RoomItemTime date={time} className="ml-2 text-sm font-light" />
      )}
    </div>
  );
};
