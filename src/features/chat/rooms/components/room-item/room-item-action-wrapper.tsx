import { Action, ActionItem, useRoomActions } from '../room-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import {
  PropsWithChildren,
  cloneElement,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
import { MoreVertical } from 'lucide-react';
import { Room } from '../../types';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useTranslation } from 'react-i18next';

import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { EBusinessConversationKeys } from '@/types/business.type';
import { RoomItem } from '.';
import { useCheckRoomRelationship } from '@/features/users/hooks/use-relationship';
export interface RoomItemActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  room: Room;
  isMuted?: boolean;
}

type Item = Omit<ActionItem, 'onAction'> & {
  onAction: () => void;
};
const EXTENSION_ALLOWED_ACTIONS: Record<EBusinessConversationKeys, Action[]> = {
  conversations: [
    'archive',
    'notify',
    'unnotify',
    'pin',
    'unpin',
    'tag',
    'delete',
  ],
  archived: ['unarchive', 'delete'],
};
const TALK_ALLOWED_ACTIONS: Action[] = [
  'notify',
  'unnotify',
  'pin',
  'unpin',
  'leave',
  'delete',
  'none',
  'archive',
  'unarchive',
  'block',
  'unblock',
];

const WAITING_ALLOWED_ACTIONS: Action[] = [
  'accept',
  'reject',
  'block',
  'unblock',
  'delete',
];

const checkAllowedActions = ({
  isBusinessRoom,
  businessConversationType,
  action,
  currentStatus,
}: {
  isBusinessRoom: boolean;
  businessConversationType: string;
  action: Action;
  currentStatus: Room['status'];
}) => {
  if (currentStatus === 'waiting')
    return WAITING_ALLOWED_ACTIONS.includes(action);
  if (currentStatus === 'archived')
    return EXTENSION_ALLOWED_ACTIONS.archived.includes(action);
  if (isBusinessRoom)
    return EXTENSION_ALLOWED_ACTIONS[
      businessConversationType as EBusinessConversationKeys
    ]?.includes(action);
  return TALK_ALLOWED_ACTIONS.includes(action);
};

export const RoomItemActionWrapper = forwardRef<
  HTMLDivElement,
  RoomItemActionWrapperProps
>(({ room, isMuted, children }, ref) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const Wrapper = isMobile ? MobileWrapper : DesktopWrapper;
  const { isBusiness, businessConversationType } = useBusinessNavigationData();
  const { relationshipStatus } = useCheckRoomRelationship(room);
  const { onAction, actionItems } = useRoomActions();
  const items = useMemo(() => {
    return actionItems
      .filter((item) => {
        const isAllowed = checkAllowedActions({
          isBusinessRoom: Boolean(isBusiness),
          businessConversationType: String(businessConversationType),
          action: item.action,
          currentStatus: room.status,
        });
        if (!isAllowed) return false;

        switch (item.action) {
          case 'notify':
            return isMuted;
          case 'unnotify':
            return !isMuted;
          case 'pin':
            return !room.isPinned;
          case 'unpin':
            return room.isPinned;
          case 'leave':
            return room.isGroup;
          case 'archive':
            return room.status === 'active';
          case 'unarchive':
            return room.status === 'archived';
          case 'block':
            return !room.isGroup && relationshipStatus !== 'blocking';
          case 'unblock':
            return !room.isGroup && relationshipStatus === 'blocking';
          case 'reject':
            return room.isGroup;
          default:
            return isAllowed;
        }
      })
      .map((item) => ({
        ...item,
        onAction: () =>
          onAction({
            action: item.action,
            room,
            isBusiness,
          }),
      }));
  }, [
    actionItems,
    businessConversationType,
    isBusiness,
    isMuted,
    onAction,
    relationshipStatus,
    room,
  ]);

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
  room,
}: PropsWithChildren &
  RoomItemActionWrapperProps & {
    items: Item[];
    room: Room;
  }) => {
  const { t } = useTranslation('common');
  return (
    <LongPressMenu>
      <LongPressMenu.Trigger className="w-full">
        {children}
      </LongPressMenu.Trigger>
      <LongPressMenu.Menu
        outsideComponent={
          <div className="mx-1 mb-3 flex-1 overflow-hidden rounded-xl">
            <RoomItem disabledAction data={room} className="w-full" />
          </div>
        }
      >
        {items.map(({ renderItem, ...item }) => {
          if (renderItem) {
            return renderItem({ item, room, setOpen: () => { } });
          }
          return (
            <LongPressMenu.Item
              key={item.action}
              startIcon={item.icon}
              color={item.color === 'error' ? 'error' : 'default'}
              onClick={item.onAction}
            >
              {t(item.label)}
            </LongPressMenu.Item>
          );
        })}
      </LongPressMenu.Menu>
    </LongPressMenu>
  );
};

const DesktopWrapper = ({
  children,
  items,
  room,
}: PropsWithChildren &
  RoomItemActionWrapperProps & {
    items: Item[];
  }) => {
  const { t } = useTranslation('common');
  const [isOpen, setOpen] = useState(false);
  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  return (
    <div className="group relative flex-1">
      {children}
      <div
        className={cn(
          'absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100',
          isOpen && 'opacity-100',
        )}
      >
        <DropdownMenu open={isOpen} onOpenChange={setOpen}>
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
            {items.map(({ renderItem, ...item }) => {
              if (renderItem) {
                return renderItem({ item, room, setOpen: onOpenChange });
              }
              return (
                <DropdownMenuItem
                  className="flex items-center active:bg-primary-200"
                  key={item.action}
                  disabled={item.disabled}
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
              );
            })}
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
