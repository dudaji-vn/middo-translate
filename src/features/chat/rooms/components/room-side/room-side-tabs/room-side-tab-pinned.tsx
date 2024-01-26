import { MainMessage } from '@/features/chat/discussion/components/main-message';
import {
  MessageActions,
  actionItems,
  useMessageActions,
} from '@/features/chat/messages/components/message-actions';

import { Button } from '@/components/actions';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Message } from '@/features/chat/messages/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { MoreVerticalIcon, PinIcon } from 'lucide-react';
import { cloneElement, useMemo } from 'react';
import { useGetPinMessage } from '../../../hooks/use-get-pin-message';
import { useRoomId } from '../../../hooks/use-roomId';
import { RoomSideTabLayout } from './room-side-tab-layout';
import { useRoomSidebarTabs } from './room-side-tabs.hook';

export interface RoomSideTabPinnedProps {}

export const RoomSideTabPinned = (props: RoomSideTabPinnedProps) => {
  const roomId = useRoomId();
  const { data } = useGetPinMessage({ roomId });
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { changeToDefault } = useRoomSidebarTabs();

  return (
    <MessageActions>
      <RoomSideTabLayout
        title="Pinned messages"
        icon={<PinIcon />}
        onBack={changeToDefault}
      >
        <div className="flex w-full flex-col divide-y divide-neutral-100  overflow-hidden p-3">
          {data?.map((pin) => {
            const isMe = pin.pinnedBy._id === currentUserId;
            const message = {
              ...pin.message,
              isPinned: true,
            };
            return (
              <div
                key={pin._id}
                className="group relative flex flex-col items-center first:-mt-3"
              >
                <div
                  key={pin._id}
                  className="group relative flex w-full items-center pt-3"
                >
                  <MainMessage message={message} />
                  <Menu isMe={isMe} message={message} />
                </div>
                <span className="ml-auto mt-1 text-xs font-light text-neutral-800">
                  Pinned by {isMe ? 'you' : pin.pinnedBy.name}
                </span>
              </div>
            );
          })}
        </div>
      </RoomSideTabLayout>
    </MessageActions>
  );
};

const Menu = ({ isMe, message }: { isMe: boolean; message: Message }) => {
  const { onAction } = useMessageActions();

  const items = useMemo(() => {
    return actionItems
      .filter((item) => {
        switch (item.action) {
          case 'copy':
            return message.type === 'text';
          case 'forward':
            return message.type !== 'call';
          case 'pin':
            return (
              !message.isPinned &&
              message.type !== 'call' &&
              message.forwardOf === undefined
            );
          case 'unpin':
            return message.isPinned;
          default:
            return true;
        }
      })
      .map((item) => ({
        ...item,
        onAction: () =>
          onAction({
            action: item.action,
            message,
            isMe,
          }),
      }));
  }, [isMe, message, onAction]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button.Icon size="xs" variant="ghost" color="default">
          <MoreVerticalIcon />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem
            disabled={item.disabled}
            key={item.action}
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
  );
};
