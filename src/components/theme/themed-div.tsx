import { forwardRef } from 'react';
export interface ThemedDivProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ThemedDiv = forwardRef<HTMLDivElement, ThemedDivProps>(
  (props, ref) => {
    return (
      <div ref={ref} {...props} className="bg-white dark:bg-neutral-950" />
    );
  },
);
ThemedDiv.displayName = 'ThemedDiv';
