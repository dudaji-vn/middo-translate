import { forwardRef } from 'react';
export interface RoomItemActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomItemActionWrapper = forwardRef<
  HTMLDivElement,
  RoomItemActionWrapperProps
>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      RoomItemActionWrapper
    </div>
  );
});
RoomItemActionWrapper.displayName = 'RoomItemActionWrapper';
