import {
  CopyIcon,
  ForwardIcon,
  PinIcon,
  ReplyIcon,
  TrashIcon,
} from 'lucide-react';
import { createContext, useContext, useState } from 'react';

import { MessageModalRemove } from './message.modal-remove';

type Action = 'remove' | 'pin' | 'reply' | 'copy' | 'forward' | 'none';
type ActionItem = {
  action: Action;
  label: string;
  icon: JSX.Element;
  color?: string;
  disabled?: boolean;
};
export const actionItems: ActionItem[] = [
  {
    action: 'copy',
    label: 'Copy',
    icon: <CopyIcon />,
    disabled: true,
  },
  {
    action: 'reply',
    label: 'Reply',
    icon: <ReplyIcon />,
    disabled: true,
  },

  {
    action: 'forward',
    label: 'Forward',
    icon: <ForwardIcon />,
    disabled: true,
  },
  {
    action: 'pin',
    label: 'Pin',
    icon: <PinIcon />,
    disabled: true,
  },
  {
    action: 'remove',
    label: 'Remove',
    icon: <TrashIcon />,
    color: 'error',
  },
];
export interface MessageActionsContextProps {
  onAction: (action: Action, id: string, isMe: boolean) => void;
}
const MessageActionsContext = createContext<
  MessageActionsContextProps | undefined
>(undefined);
export const useMessageActions = () => {
  const context = useContext(MessageActionsContext);
  if (context === undefined) {
    throw new Error('useMessageActions must be used within a MessageActions');
  }
  return context;
};
export const MessageActions = ({ children }: { children: React.ReactNode }) => {
  const [id, setId] = useState<string>('');
  const [isMe, setIsMe] = useState<boolean>(false);
  const [action, setAction] = useState<Action>('none');
  const onAction = (action: Action, id: string, isMe: boolean) => {
    setAction(action);
    setId(id);
    setIsMe(isMe);
  };
  const reset = () => {
    setAction('none');
    setIsMe(false);
    setId('');
  };

  return (
    <MessageActionsContext.Provider
      value={{
        onAction,
      }}
    >
      {children}
      {action === 'remove' && (
        <MessageModalRemove onClosed={reset} id={id} isMe={isMe} />
      )}
    </MessageActionsContext.Provider>
  );
};
