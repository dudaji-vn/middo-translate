import {
  BellIcon,
  BellOffIcon,
  LogOut,
  PinIcon,
  TrashIcon,
} from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';

import { RoomModalDelete } from './room.modal-delete';
import { RoomModalLeave } from './room.modal-leave';
import { RoomModalNotification } from './room.modal-notification';

export type Action =
  | 'delete'
  | 'pin'
  | 'leave'
  | 'notify'
  | 'none'
  | 'unnofity';
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
  const onAction = (action: Action, id: string) => {
    console.log(action, id);
    setAction(action);
    setId(id);
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
      case 'unnofity':
        return (
          <RoomModalNotification onClosed={reset} id={id} type="turnOff" />
        );
      default:
        return null;
    }
  }, [action, id]);

  const actionItems: ActionItem[] = useMemo(() => {
    return [
      {
        action: 'pin',
        label: 'Pin',
        icon: <PinIcon />,
        disabled: true,
      },
      {
        action: 'notify',
        label: 'On',
        icon: <BellIcon />,
      },
      {
        action: 'unnofity',
        label: 'Off',
        icon: <BellOffIcon />,
      },
      {
        action: 'leave',
        label: 'Leave',
        icon: <LogOut />,
      },

      {
        action: 'delete',
        label: 'Delete',
        icon: <TrashIcon />,
        color: 'error',
      },
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
