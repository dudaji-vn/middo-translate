import {
  Archive,
  ArchiveX,
  BellIcon,
  BellOffIcon,
  CheckSquare,
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
  | 'unarchive';

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
export interface RoomActionsContextProps {
  onAction: (action: Action, id: string, isBusiness?: boolean) => void;
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
  const [id, setId] = useState<string>('');
  const [action, setAction] = useState<Action>('none');
  const { mutate: pin } = usePinRoom();
  const { toggleArchive } = useToggleArchiveRoom();
  const onAction = (action: Action, id: string, isBusiness?: boolean) => {
    switch (action) {
      case 'pin':
      case 'unpin':
        pin(id);
        break;
      case 'archive':
        if (isBusiness) {
          setAction('archive');
          setId(id);
          return;
        }
        toggleArchive({
          roomId: id,
          archive: true,
        });
        break;
      case 'unarchive':
        if (isBusiness) {
          setAction('unarchive');
          setId(id);
          return;
        }
        toggleArchive({
          roomId: id,
          archive: false,
        });
        break;
      default:
        setAction(action);
        setId(id);
        break;
    }
  };
  const reset = () => {
    setAction('none');
    setId('');
  };

  const Modal = useMemo(() => {
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
      case 'tag':
        return null;
      default:
        return null;
    }
  }, [action, id]);

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
