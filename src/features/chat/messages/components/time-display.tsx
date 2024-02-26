import { cn } from '@/utils/cn';
import { formatTimeDisplay } from '../../rooms/utils';

export interface LimeDisplayProps {
  time?: string;
  className?: string;
}

export const TimeDisplay = ({ className, time }: LimeDisplayProps) => {
  if (!time) return null;
  return (
    <div className={cn('my-2 flex items-center justify-center', className)}>
      <div className="flex h-12 items-center justify-center space-x-2">
        <div className="bg-primary/30 h-[1px] w-16" />
        <span className="text-sm  font-light text-neutral-300">
          {formatTimeDisplay(time)}
        </span>
        <div className="bg-primary/30 h-[1px] w-16" />
      </div>
    </div>
  );
};
