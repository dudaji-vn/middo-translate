import { Edit2Outline } from '@easy-eva-icons/react';
import { IconButton } from '../button';
import { forwardRef } from 'react';

export interface EditButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export const EditButton = forwardRef<HTMLButtonElement, EditButtonProps>(
  (props, ref) => {
    return (
      <IconButton ref={ref} {...props}>
        <Edit2Outline />
      </IconButton>
    );
  },
);
EditButton.displayName = 'EditButton';
