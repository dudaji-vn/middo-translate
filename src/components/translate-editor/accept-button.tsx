import { CheckmarkCircle2Outline } from '@easy-eva-icons/react';
import { forwardRef } from 'react';

export interface AcceptButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export const AcceptButton = forwardRef<HTMLButtonElement, AcceptButtonProps>(
  (props, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className="circleButton ml-auto !bg-success !text-white shadow-1"
      >
        <CheckmarkCircle2Outline className="h-5 w-5" />
      </button>
    );
  },
);
AcceptButton.displayName = 'AcceptButton';
