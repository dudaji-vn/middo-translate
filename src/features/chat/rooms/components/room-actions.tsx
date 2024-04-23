import {
  Archive,
  ArchiveX,
  BellIcon,
  BellOffIcon,
  CheckSquare,
  LogOut,
  PinIcon,
  PinOffIcon,
  TrashIcon,
} from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';

import { RoomModalDelete } from './room.modal-delete';
import { RoomModalLeave } from './room.modal-leave';
import { RoomModalNotification } from './room.modal-notification';
import { usePinRoom } from '../hooks/use-pin-room';
import { RoomModalChangeStatus } from './room.modal-change-status';

export type Action =
  | 'delete'
  | 'pin'
  | 'unpin'
  | 'leave'
  | 'notify'
  | 'none'
  | 'unnotify'
  | 'archive'
  | 'unarchive'
  ;

export type ActionItem = {
  action: Action;
  label: string;
  icon: JSX.Element;
  color?: string;
  disabled?: boolean;
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
  const { mutate: pin } = usePinRoom();
  const onAction = (action: Action, id: string) => {
    switch (action) {
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
        return <RoomModalChangeStatus onClosed={reset} id={id} actionName={action} />;
      default:
        return null;
    }
  }, [action, id]);

  const actionItems: ActionItem[] = useMemo(() => {
    return [
      {
        action: 'pin',
        label: "CONVERSATION.PIN",
        icon: <PinIcon />,
      },
      {
        action: 'unpin',
        label: "CONVERSATION.UNPIN",
        icon: <PinOffIcon />,
      },
      {
        action: 'notify',
        label: "CONVERSATION.ON",
        icon: <BellIcon />,
      },
      {
        action: 'unnotify',
        label: "CONVERSATION.OFF",
        icon: <BellOffIcon />,
      },
      {
        action: 'leave',
        label: "COMMON.LEAVE",
        icon: <LogOut />,
      },

      {
        action: 'delete',
        label: "COMMON.DELETE",
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
      }
    ];
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
