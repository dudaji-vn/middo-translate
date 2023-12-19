import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { actionItems, useMessageActions } from '../message.actions';

import { Button } from '@/components/actions';
import { Message } from '@/features/chat/messages/types';
import { MoreVertical } from 'lucide-react';
import { cloneElement } from 'react';
import { cn } from '@/utils/cn';

export interface MenuProps {
  message: Message;
  isMe: boolean;
}

export const Menu = ({ message, isMe }: MenuProps) => {
  const { onAction } = useMessageActions();
  return (
    <div
      className={cn(
        'absolute top-1/2 hidden -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block',
        isMe ? '-left-4 -translate-x-full' : '-right-4 translate-x-full',
      )}
    >
      {message.status !== 'removed' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon size="sm" variant="ghost" color="default">
              <MoreVertical />
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {actionItems.map((item) => (
              <DropdownMenuItem
                disabled={item.disabled}
                key={item.action}
                onClick={() => onAction(item.action, message._id, isMe)}
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
      )}
    </div>
  );
};
