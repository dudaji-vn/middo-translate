import { ActionItem, useRoomActions } from '../room-actions';
import { BellOffIcon, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { PropsWithChildren, cloneElement, forwardRef, useMemo } from 'react';

import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
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
    const itemFiltered: Item[] = [];
    actionItems.forEach((item) => {
      if (item.action === 'notify' && !isMuted) return;
      if (item.action === 'unnofity' && isMuted) return;
      itemFiltered.push({
        ...item,
        onAction: () => onAction(item.action, room._id),
      });
    });
    return itemFiltered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted, room._id]);
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
    <div className="group relative">
      {children}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon
              size="md"
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
