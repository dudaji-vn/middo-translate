import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { cloneElement, forwardRef } from 'react';

import { Button } from '@/components/actions/button';
import { MoreVertical } from 'lucide-react';
import { Room } from '../../types';
import { cn } from '@/utils/cn';
import { useRoomActions } from '../room-actions';

export interface RoomItemMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  room: Room;
}

export const RoomItemMenu = forwardRef<HTMLDivElement, RoomItemMenuProps>(
  (props, ref) => {
    const { onAction, actionItems } = useRoomActions();
    return (
      <div ref={ref} {...props}>
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
            {actionItems.map((item) => (
              <DropdownMenuItem
                key={item.action}
                disabled={item.disabled}
                className="flex items-center"
                onClick={() => onAction(item.action, props.room._id)}
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
    );
  },
);
RoomItemMenu.displayName = 'RoomItemMenu';
