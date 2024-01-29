import { formatTimeDisplay } from '../../rooms/utils';

export interface LimeDisplayProps {
  time?: string;
}

export const TimeDisplay = (props: LimeDisplayProps) => {
  if (!props.time) return null;
  return (
    <div className="my-2 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="bg-primary/30 h-[1px] w-16" />
        <div className="text-sm font-light text-neutral-300">
          {formatTimeDisplay(props.time)}
        </div>
        <div className="bg-primary/30 h-[1px] w-16" />
      </div>
    </div>
  );
};
