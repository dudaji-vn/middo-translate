import { ActionItem, useRoomActions } from '../room-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { PropsWithChildren, cloneElement, forwardRef, useMemo } from 'react';

import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
import { MoreVertical } from 'lucide-react';
import { Room } from '../../types';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';

export interface RoomItemActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  room: Room;
  isMuted?: boolean;
}

type Item = Omit<ActionItem, 'onAction'> & {
  onAction: () => void;
};

export const RoomItemActionWrapper = forwardRef<
  HTMLDivElement,
  RoomItemActionWrapperProps
>(({ room, isMuted, children }, ref) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const Wrapper = isMobile ? MobileWrapper : DesktopWrapper;
  const { onAction, actionItems } = useRoomActions();
  const items = useMemo(() => {
    return actionItems
      .filter((item) => {
        switch (item.action) {
          case 'notify':
            return !isMuted;
          case 'unnotify':
            return isMuted;
          case 'pin':
            return !room.isPinned;
          case 'unpin':
            return room.isPinned;
          case 'leave':
            return room.isGroup;
          default:
            return true;
        }
      })
      .map((item) => ({
        ...item,
        onAction: () => onAction(item.action, room._id),
      }));
  }, [actionItems, isMuted, onAction, room._id, room.isGroup, room.isPinned]);

  return (
    <Wrapper items={items} room={room} isMuted={isMuted}>
      {children}
    </Wrapper>
  );
});

RoomItemActionWrapper.displayName = 'RoomItemActionWrapper';

const MobileWrapper = ({
  children,
  items,
}: PropsWithChildren &
  RoomItemActionWrapperProps & {
    items: Item[];
  }) => {
  return (
    <LongPressMenu>
      <LongPressMenu.Trigger className="w-full">
        {children}
      </LongPressMenu.Trigger>
      <LongPressMenu.Menu>
        {items.map((item) => (
          <LongPressMenu.Item
            key={item.action}
            title={item.label}
            color={item.color === 'error' ? 'error' : 'default'}
            onClick={item.onAction}
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
  items,
}: PropsWithChildren &
  RoomItemActionWrapperProps & {
    items: Item[];
  }) => {
  return (
    <div className="group relative flex-1">
      {children}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon
              size="xs"
              variant="default"
              color="default"
              className="border shadow"
            >
              <MoreVertical />
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {items.map((item) => (
              <DropdownMenuItem
                key={item.action}
                disabled={item.disabled}
                className="flex items-center"
                onClick={item.onAction}
              >
                {cloneElement(item.icon, {
                  size: 16,
                  className: cn('mr-2', item.color && `text-${item.color}`),
                })}
                <span className={cn(item.color && `text-${item.color}`)}>
                  {item.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const RoomItemActionWrapperDisabled = forwardRef<
  HTMLDivElement,
  RoomItemActionWrapperProps
>(({ children }, ref) => {
  return <>{children}</>;
});

RoomItemActionWrapperDisabled.displayName = 'RoomItemActionWrapperDisabled';
