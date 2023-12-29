import { cn } from '@/utils/cn';

export interface RoomItemHeadProps {
  name?: string;
  isRead?: boolean;
  showTime?: boolean;
  time?: string;
}

export const RoomItemHead = ({
  name,
  isRead,
  showTime,
  time,
}: RoomItemHeadProps) => {
  return (
    <div className="mb-1 flex items-center justify-between">
      <div className="max-w-full">
        <span
          className={cn(
            'line-clamp-1 break-all ',
            isRead ? 'font-normal' : 'font-semibold',
          )}
        >
          {name}
        </span>
      </div>
      {time && showTime && (
        <span className="ml-auto shrink-0 pl-2 text-sm font-light">{time}</span>
      )}
    </div>
  );
};
