import { cn } from '@/utils/cn';
import { Typography } from '.';
import { forwardRef } from 'react';
export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ label, children, labelClassName, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <div className="pb-2 pl-3">
          <Typography
            variant="h5"
            className={cn('text-base font-normal opacity-60', labelClassName)}
          >
            {label}
          </Typography>
        </div>
        <div>{children}</div>
      </div>
    );
  },
);
Section.displayName = 'Section';
