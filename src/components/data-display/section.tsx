import { cn } from '@/utils/cn';
import { Typography } from '.';
import { forwardRef } from 'react';
export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
  labelRight?: React.ReactNode;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ label, children, labelClassName, labelRight, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <div className="flex items-center justify-between px-3 pb-2">
          <Typography
            variant="h5"
            className={cn('text-base font-normal opacity-60', labelClassName)}
          >
            {label}
          </Typography>
          {labelRight}
        </div>
        <div>{children}</div>
      </div>
    );
  },
);
Section.displayName = 'Section';
