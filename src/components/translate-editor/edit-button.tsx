import { Edit2Outline } from '@easy-eva-icons/react';
import { forwardRef } from 'react';

export interface EditButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export const EditButton = forwardRef<HTMLButtonElement, EditButtonProps>(
  (props, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className="circleButton ml-auto border border-primary !bg-primary !text-white shadow-1 active:!bg-transparent active:!text-primary md:hover:text-primary"
      >
        <Edit2Outline className="h-5 w-5" />
      </button>
    );
  },
);
EditButton.displayName = 'EditButton';
