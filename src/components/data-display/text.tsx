import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const Text = forwardRef<HTMLDivElement, TextProps>(
  ({ value, ...props }, ref) => {
    const arrayNewLine = value.split('\n');
    return (
      <>
        {arrayNewLine.map((item, index) => {
          return (
            <span className={cn('break-word-mt', props.className)} key={index}>
              {item}
              <br />
            </span>
          );
        })}
      </>
    );
  },
);
Text.displayName = 'Text';
