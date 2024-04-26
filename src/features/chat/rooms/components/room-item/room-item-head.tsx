import { RoomItemTime } from './room-item-time';
import { cn } from '@/utils/cn';
import { useRoomItem } from './room-item';
import { Badge } from '@/components/ui/badge';
import { getContrastingTextColor } from '@/utils/color-generator';

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
      <div className="flex max-w-full flex-row w-full items-center gap-2">
        {data.tag && (
          <Badge
            variant="default"
            style={{
              backgroundColor: data.tag.color,
              color: getContrastingTextColor(data.tag.color),
            }}
            className={'max-w-40 line-clamp-1 capitalize'}
          >
            {data.tag.name}
          </Badge>
        )}
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
