import { PropsWithChildren, forwardRef } from 'react';
import { roomActionItems, useRoomActions } from '../room.actions';

import { LongPressMenu } from '@/components/actions/long-press-menu';
import { Room } from '../../types';
import { RoomItemMenu } from './room-item.menu';
import { useAppStore } from '@/stores/app.store';

export interface RoomItemActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  room: Room;
}

export const RoomItemActionWrapper = forwardRef<
  HTMLDivElement,
  RoomItemActionWrapperProps
>(({ room, children }, ref) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const Wrapper = isMobile ? MobileWrapper : DesktopWrapper;
  return <Wrapper room={room}>{children}</Wrapper>;
});

RoomItemActionWrapper.displayName = 'RoomItemActionWrapper';

const MobileWrapper = ({
  children,
  room,
}: PropsWithChildren & RoomItemActionWrapperProps) => {
  const { onAction } = useRoomActions();

  return (
    <LongPressMenu>
      <LongPressMenu.Trigger className="w-full">
        {children}
      </LongPressMenu.Trigger>
      <LongPressMenu.Menu>
        {roomActionItems.map((item) => (
          <LongPressMenu.Item
            key={item.action}
            title={item.label}
            color={item.color === 'error' ? 'error' : 'default'}
            onClick={() => onAction(item.action, room._id)}
          >
            {item.icon}
          </LongPressMenu.Item>
        ))}
      </LongPressMenu.Menu>
    </LongPressMenu>
  );
};

const DesktopWrapper = ({
  children,
  room,
}: PropsWithChildren & RoomItemActionWrapperProps) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <RoomItemMenu room={room} />
      </div>
    </div>
  );
};
