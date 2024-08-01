import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import {
  Fragment,
  PropsWithChildren,
  cloneElement,
  forwardRef,
  useMemo,
  useState,
} from 'react';
import { Action, ActionItem, useRoomActions } from '../room-actions';

import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Room } from '../../types';

import { useCheckRoomRelationship } from '@/features/users/hooks/use-relationship';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { EBusinessConversationKeys } from '@/types/business.type';
import { RoomItem } from '.';
import { InboxType } from '../inbox/inbox';
export interface RoomItemActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  room: Room;
  isMuted?: boolean;
  type?: InboxType;
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

const CONTACT_ALLOWED_ACTIONS: Action[] = [
  'copy_username',
  'block',
  'delete-contact',
];

const checkAllowedActions = ({
  isBusinessRoom,
  businessConversationType,
  action,
  currentStatus,
  tab,
}: {
  isBusinessRoom: boolean;
  businessConversationType: string;
  action: Action;
  currentStatus: Room['status'];
  tab?: InboxType;
}) => {
  if (tab === 'contact') return CONTACT_ALLOWED_ACTIONS.includes(action);
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
>(({ room, isMuted, children, type }, ref) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const Wrapper = isMobile ? MobileWrapper : DesktopWrapper;
  return (
    <Wrapper room={room} isMuted={isMuted}>
      {children}
    </Wrapper>
  );
});

RoomItemActionWrapper.displayName = 'RoomItemActionWrapper';

const MobileWrapper = ({
  children,
  room,
  type,
}: PropsWithChildren & RoomItemActionWrapperProps) => {
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
        <MobileMenuItems room={room} type={type} />
      </LongPressMenu.Menu>
    </LongPressMenu>
  );
};

const DesktopWrapper = ({
  children,
  room,
  type,
}: PropsWithChildren & RoomItemActionWrapperProps & {}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="group relative flex-1 overflow-hidden">
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
          <DropdownMenuContent className="dark:border-neutral-800 dark:bg-neutral-900">
            <DesktopMenuItems room={room} setOpen={setOpen} type={type} />
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
type MenuItemsProps = {
  room: Room;
  setOpen?: (open: boolean) => void;
  type?: InboxType;
  isMuted?: boolean;
};
const DesktopMenuItems = ({ room, setOpen, type, isMuted }: MenuItemsProps) => {
  const { relationshipStatus } = useCheckRoomRelationship(room);
  const { isBusiness, businessConversationType } = useBusinessNavigationData();
  const { t } = useTranslation('common');

  const { onAction, actionItems } = useRoomActions();
  const items = useMemo(() => {
    return generateActionItems({
      room,
      isMuted,
      type,
      isBusiness,
      businessConversationType,
      items: actionItems,
      relationshipStatus,
      onAction,
    });
  }, [
    actionItems,
    businessConversationType,
    isBusiness,
    isMuted,
    onAction,
    relationshipStatus,
    room,
    type,
  ]);
  return (
    <Fragment>
      {items.map(({ renderItem, ...item }) => {
        if (renderItem) {
          return renderItem({ item, room, setOpen: setOpen! });
        }
        return (
          <DropdownMenuItem
            className="flex items-center active:bg-primary-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
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
    </Fragment>
  );
};

const MobileMenuItems = ({ room, isMuted, type }: MenuItemsProps) => {
  const { relationshipStatus } = useCheckRoomRelationship(room);
  const { isBusiness, businessConversationType } = useBusinessNavigationData();
  const { t } = useTranslation('common');

  const { onAction, actionItems } = useRoomActions();
  const items = useMemo(() => {
    return generateActionItems({
      room,
      isMuted,
      type,
      isBusiness,
      businessConversationType,
      items: actionItems,
      relationshipStatus,
      onAction,
    });
  }, [
    actionItems,
    businessConversationType,
    isBusiness,
    isMuted,
    onAction,
    relationshipStatus,
    room,
    type,
  ]);
  return (
    <Fragment>
      {items.map(({ renderItem, ...item }) => {
        if (renderItem) {
          return renderItem({ item, room, setOpen: () => {} });
        }
        return (
          <LongPressMenu.Item
            key={item.action}
            startIcon={item.icon}
            color={item.color === 'error' ? 'error' : 'default'}
            onClick={item.onAction}
            className="dark:hover:bg-neutral-900"
          >
            {t(item.label)}
          </LongPressMenu.Item>
        );
      })}
    </Fragment>
  );
};

RoomItemActionWrapperDisabled.displayName = 'RoomItemActionWrapperDisabled';

const generateActionItems = ({
  room,
  isMuted,
  type,
  isBusiness,
  businessConversationType,
  items,
  relationshipStatus,
  onAction,
}: {
  items: ActionItem[];
  room: Room;
  isMuted?: boolean;
  type?: InboxType;
  isBusiness?: boolean;
  businessConversationType?: string | string[] | null | undefined;
  relationshipStatus: string;
  onAction: (args: {
    action: Action;
    room: Room;
    isBusiness?: boolean;
  }) => void;
}) => {
  return items
    .filter((item) => {
      const isAllowed = checkAllowedActions({
        isBusinessRoom: Boolean(isBusiness),
        businessConversationType: String(businessConversationType),
        action: item.action,
        currentStatus: room.status,
        tab: type,
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
          return (
            !room.isGroup &&
            relationshipStatus !== 'blocking' &&
            relationshipStatus !== 'me'
          );
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
};
