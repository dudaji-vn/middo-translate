import {
  CopyIcon,
  ForwardIcon,
  PinIcon,
  ReplyIcon,
  TrashIcon,
} from 'lucide-react';
import { createContext, useContext, useState } from 'react';

import { Message } from '../types';
import { MessageModalRemove } from './message-modal-remove';
import { useCopyMessage } from '../hooks/use-copy-message';
import { useTextCopy } from '@/hooks/use-text-copy';

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

type OnActionParams = {
  action: Action;
  message: Message;
  isMe: boolean;
};
export interface MessageActionsContextProps {
  onAction: (params: OnActionParams) => void;
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
  const { copyMessage } = useCopyMessage();
  const onAction = ({ action, isMe, message }: OnActionParams) => {
    if (action === 'copy') {
      copyMessage(message);
      return;
    }
    setAction(action);
    setId(message._id);
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
