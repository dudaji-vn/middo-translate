import {
  Archive,
  ArchiveX,
  BanIcon,
  BellIcon,
  BellOffIcon,
  LogOut,
  PinIcon,
  PinOffIcon,
  Tag,
  TrashIcon,
} from 'lucide-react';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { RoomModalDelete } from './room.modal-delete';
import { RoomModalLeave } from './room.modal-leave';
import { RoomModalNotification } from './room.modal-notification';
import { usePinRoom } from '../hooks/use-pin-room';
import { RoomModalChangeStatus } from './room.modal-change-status';
import RoomAssignTag from './room-assign-tag';
import { Room } from '../types';
import { useToggleArchiveRoom } from '../hooks/use-toggle-archive-room';
import { UserBlockModal } from '@/features/users/components/user-block-modal';
import { useAuthStore } from '@/stores/auth.store';
import { useUnBlockUser } from '@/features/users/hooks/use-unblock-user';

export type Action =
  | 'delete'
  | 'pin'
  | 'unpin'
  | 'leave'
  | 'notify'
  | 'none'
  | 'unnotify'
  | 'archive'
  | 'tag'
  | 'unarchive'
  | 'block'
  | 'unblock';

export type ActionItem = {
  action: Action;
  label: string;
  icon: JSX.Element;
  color?: string;
  disabled?: boolean;
  renderItem?: (params: {
    item: Omit<ActionItem, 'renderItem'> & { onAction: () => void };
    room: Room;
    setOpen: (value: boolean) => void;
  }) => JSX.Element | ReactNode;
};

type OnActionParams = {
  action: Action;
  room: Room;
  isBusiness?: boolean;
};
export interface RoomActionsContextProps {
  onAction: (params: OnActionParams) => void;
  actionItems: ActionItem[];
}
const RoomActionsContext = createContext<RoomActionsContextProps | undefined>(
  undefined,
);
export const useRoomActions = () => {
  const context = useContext(RoomActionsContext);
  if (context === undefined) {
    throw new Error('useRoomActions must be used within a RoomActions');
  }
  return context;
};
export const RoomActions = ({ children }: { children: React.ReactNode }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const currentUserId = useAuthStore((state) => state.user?._id);
  const [action, setAction] = useState<Action>('none');
  const { mutate: pin } = usePinRoom();
  const { toggleArchive } = useToggleArchiveRoom();
  const { mutate: unblock } = useUnBlockUser();
  const onAction = ({ action, room, isBusiness }: OnActionParams) => {
    const roomId = room?._id;
    switch (action) {
      case 'pin':
      case 'unpin':
        pin(roomId);
        break;
      case 'archive':
        if (isBusiness) {
          setAction('archive');
          setRoom(room);
          return;
        }
        toggleArchive({
          roomId,
          archive: true,
        });
        break;
      case 'unarchive':
        if (isBusiness) {
          setAction('unarchive');
          setRoom(room);
          return;
        }
        toggleArchive({
          roomId,
          archive: false,
        });
        break;
      case 'unblock':
        const otherUser = room.participants.find(
          (participant) => participant._id !== currentUserId,
        );

        if (!otherUser) return;
        unblock(otherUser._id);
        break;
      default:
        setAction(action);
        setRoom(room);
        break;
    }
  };
  const reset = () => {
    setAction('none');
    setRoom(null);
  };

  const Modal = useMemo(() => {
    if (!room) return null;
    const id = room._id;
    switch (action) {
      case 'delete':
        return <RoomModalDelete onClosed={reset} id={id} />;
      case 'leave':
        return <RoomModalLeave onClosed={reset} id={id} />;
      case 'notify':
        return <RoomModalNotification onClosed={reset} id={id} type="turnOn" />;
      case 'unnotify':
        return (
          <RoomModalNotification onClosed={reset} id={id} type="turnOff" />
        );
      case 'archive':
      case 'unarchive':
        return (
          <RoomModalChangeStatus onClosed={reset} id={id} actionName={action} />
        );
      case 'block':
        const otherUser = room.participants.find(
          (participant) => participant._id !== currentUserId,
        );
        if (!otherUser) return null;
        return <UserBlockModal room={room} onClosed={reset} user={otherUser} />;
      case 'unblock':
        return null;
      case 'tag':
        return null;
      default:
        return null;
    }
  }, [action, currentUserId, room]);

  const actionItems: ActionItem[] = useMemo(() => {
    return [
      {
        action: 'pin',
        label: 'CONVERSATION.PIN',
        icon: <PinIcon />,
      },
      {
        action: 'unpin',
        label: 'CONVERSATION.UNPIN',
        icon: <PinOffIcon />,
      },
      {
        action: 'notify',
        label: 'CONVERSATION.ON',
        icon: <BellIcon />,
      },
      {
        action: 'unnotify',
        label: 'CONVERSATION.OFF',
        icon: <BellOffIcon />,
      },
      {
        action: 'tag',
        label: 'CONVERSATION.TAG',
        icon: <Tag />,
        renderItem(params) {
          return (
            <RoomAssignTag
              room={params.room}
              key={params.item.action}
              onClosed={() => {
                reset();
                params.setOpen(false);
              }}
            />
          );
        },
      },
      {
        action: 'leave',
        label: 'COMMON.LEAVE',
        icon: <LogOut />,
      },

      {
        action: 'archive',
        label: 'COMMON.ARCHIVE',
        icon: <Archive />,
      },
      {
        action: 'unarchive',
        label: 'COMMON.UNARCHIVE',
        icon: <ArchiveX />,
      },
      {
        action: 'block',
        label: 'COMMON.BLOCK',
        icon: <BanIcon />,
        color: 'error',
      },
      {
        action: 'unblock',
        label: 'COMMON.UNBLOCK',
        icon: <BanIcon />,
      },
      {
        action: 'delete',
        label: 'COMMON.DELETE',
        icon: <TrashIcon />,
        color: 'error',
      },
    ] as ActionItem[];
  }, []);

  return (
    <RoomActionsContext.Provider
      value={{
        onAction,
        actionItems,
      }}
    >
      {children}
      {Modal}
    </RoomActionsContext.Provider>
  );
};
