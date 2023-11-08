import { CheckmarkCircle2Outline } from '@easy-eva-icons/react';
import { IconButton } from '../button';
import { forwardRef } from 'react';

export interface AcceptButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export const AcceptButton = forwardRef<HTMLButtonElement, AcceptButtonProps>(
  (props, ref) => {
    return (
      <IconButton ref={ref} {...props} variant="success">
        <CheckmarkCircle2Outline />
      </IconButton>
    );
  },
);
AcceptButton.displayName = 'AcceptButton';
