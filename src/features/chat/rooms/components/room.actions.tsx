import { BellIcon, LogOut, PinIcon, TrashIcon } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

import { RoomModalDelete } from './room.modal-delete';
import { RoomModalLeave } from './room.modal-leave';

type Action = 'delete' | 'pin' | 'leave' | 'notify' | 'none';
type ActionItem = {
  action: Action;
  label: string;
  icon: JSX.Element;
  color?: string;
  disabled?: boolean;
};
export const roomActionItems: ActionItem[] = [
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
export interface RoomActionsContextProps {
  onAction: (action: Action, id: string) => void;
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
    setAction(action);
    setId(id);
  };
  const reset = () => {
    setAction('none');
    setId('');
  };

  return (
    <RoomActionsContext.Provider
      value={{
        onAction,
      }}
    >
      {children}
      {action === 'delete' && <RoomModalDelete onClosed={reset} id={id} />}
      {action === 'leave' && <RoomModalLeave onClosed={reset} id={id} />}
    </RoomActionsContext.Provider>
  );
};
