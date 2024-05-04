import { cn } from '@/utils/cn';
import moment from 'moment';

export interface LimeDisplayProps {
  time?: string;
  className?: string;
}

export const TimeDisplay = ({ className, time }: LimeDisplayProps) => {
  if (!time) return null;
  return (
    <div
      className={cn('my-0.5 flex items-center justify-center gap-3', className)}
    >
      <div className="h-[1px] flex-1 bg-neutral-100" />
      <div className="flex items-center justify-center">
        <div className="bg-primary/30 h-[1px]" />
        <span className="text-xs font-light text-neutral-500">
          {moment(time).format('YYYY, MMM DD')}
        </span>
      </div>
      <div className="h-[1px] flex-1 bg-neutral-100" />
    </div>
  );
};
