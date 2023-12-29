import { Typography } from '.';
import { forwardRef } from 'react';
export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: React.ReactNode;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ label, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <div className="pb-2 pl-3">
          <Typography variant="h5" className="font-normal opacity-60">
            {label}
          </Typography>
        </div>
        <div>{children}</div>
      </div>
    );
  },
);
Section.displayName = 'Section';
