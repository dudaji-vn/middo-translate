import { Action, ActionItem, useRoomActions } from '../room-actions';
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
import { useTranslation } from 'react-i18next';

import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { EBusinessConversationKeys } from '@/types/business.type';
export interface RoomItemActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  room: Room;
  isMuted?: boolean;
}

type Item = Omit<ActionItem, 'onAction'> & {
  onAction: () => void;
};
const BUSINESS_ALLOWED_ACTIONS: Record<EBusinessConversationKeys, Action[]> = {
  conversations: ['archive', 'complete', 'notify', 'unnotify', 'pin', 'unpin'],
  archived: ['unarchive', 'delete'],
  completed: ['delete'],
};
const TALK_ALLOWED_ACTIONS: Action[] = ['notify', 'unnotify', 'pin', 'unpin', 'leave', 'delete', 'none'];

const checkAllowedActions = (isBusinessRoom: boolean, businessConversationType: string, action: Action, currentStatus: Room['status']) => {
  if (currentStatus === 'completed') return BUSINESS_ALLOWED_ACTIONS.completed.includes(action);
  if (currentStatus === 'archived') return BUSINESS_ALLOWED_ACTIONS.archived.includes(action);
  if (isBusinessRoom) return BUSINESS_ALLOWED_ACTIONS[businessConversationType as EBusinessConversationKeys]?.includes(action);
  return TALK_ALLOWED_ACTIONS.includes(action);
}


export const RoomItemActionWrapper = forwardRef<
  HTMLDivElement,
  RoomItemActionWrapperProps
>(({ room, isMuted, children }, ref) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const Wrapper = isMobile ? MobileWrapper : DesktopWrapper;
  const { isBusiness, businessConversationType } = useBusinessNavigationData();
  const { onAction, actionItems } = useRoomActions();
  const items = useMemo(() => {
    return actionItems
      .filter((item) => {
        const isAllowed = checkAllowedActions(Boolean(isBusiness), String(businessConversationType), item.action, room.status);
  
        switch (item.action) {
          case 'notify':
            return isAllowed && isMuted;
          case 'unnotify':
            return isAllowed && !isMuted;
          case 'pin':
            return isAllowed && !room.isPinned;
          case 'unpin':
            return isAllowed && room.isPinned;
          case 'leave':
            return isAllowed && room.isGroup;
          case 'archive':
            return isAllowed && room.status === 'active';
          case 'unarchive':
            return isAllowed && room.status === 'archived';
          case 'complete':
            return isAllowed && room.status === 'active';
          default:
            return isAllowed;
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
  const {t} = useTranslation('common');
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
                  {t(item.label)}
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
