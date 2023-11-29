import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  rightContent?: React.ReactNode;
  content: string;
  leftContent?: React.ReactNode;
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-7 items-center gap-1 rounded-full bg-primary/10 p-1 px-2',
          className,
        )}
      >
        {props.leftContent}
        <span className="line-clamp-1 text-sm text-primary/60">
          {props.content}
        </span>
        {props.rightContent}
      </div>
    );
  },
);
Chip.displayName = 'Chip';
