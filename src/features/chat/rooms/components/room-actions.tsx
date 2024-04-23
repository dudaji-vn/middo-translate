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
  }) => JSX.Element | ReactNode;
};
export interface RoomActionsContextProps {
  onAction: (action: Action, id: string) => void;
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
  const [idRoomAssignTag, setIdRoomAssignTag] = useState<string>('');
  const { mutate: pin } = usePinRoom();
  const onAction = (action: Action, id: string) => {
    switch (action) {
      case 'tag':
        // because update the state "id" will re-render RoomAssignTag, it's a popover, so I need to keep it not re-render
        setIdRoomAssignTag(id);
        break;
      case 'pin':
      case 'unpin':
        pin(id);
        break;
      default:
        setAction(action);
        setId(id);
        break;
    }
  };
  const reset = () => {
    setAction('none');
    setIdRoomAssignTag('');
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
        renderItem({ item: { onAction, action } }) {
          return (
            <RoomAssignTag
              id={idRoomAssignTag}
              key={action}
              onAction={onAction}
              onClosed={reset}
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
        action: 'delete',
        label: 'COMMON.DELETE',
        icon: <TrashIcon />,
        color: 'error',
      },
      {
        action: 'archive',
        label: 'Archive',
        icon: <Archive />,
      },
      {
        action: 'unarchive',
        label: 'Unarchive',
        icon: <ArchiveX />,
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
