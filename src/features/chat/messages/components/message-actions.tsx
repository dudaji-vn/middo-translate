import {
  CopyIcon,
  ForwardIcon,
  PinIcon,
  ReplyIcon,
  TrashIcon,
} from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';

import { useClickReplyMessage } from '../hooks/use-click-reply-message';
import { useCopyMessage } from '../hooks/use-copy-message';
import { Message } from '../types';
import { ForwardModal } from './forward-modal';
import { MessageModalRemove } from './message-modal-remove';

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
  },

  {
    action: 'forward',
    label: 'Forward',
    icon: <ForwardIcon />,
  },
  {
    action: 'pin',
    label: 'Pin',
    icon: <PinIcon />,
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
  const [message, setMessage] = useState<Message | null>(null);
  const [isMe, setIsMe] = useState<boolean>(false);
  const [action, setAction] = useState<Action>('none');
  const { copyMessage } = useCopyMessage();
  const { onClickReplyMessage } = useClickReplyMessage();
  const onAction = ({ action, isMe, message }: OnActionParams) => {
    switch (action) {
      case 'copy':
        copyMessage(message);
        break;
      case 'reply':
        onClickReplyMessage(message._id);
        break;
      case 'pin':
        break;

      default:
        setAction(action);
        setMessage(message);
        setIsMe(isMe);
        break;
    }
  };
  const reset = () => {
    setAction('none');
    setIsMe(false);
    setMessage(null);
  };

  const Modal = useMemo(() => {
    if (!message) return null;
    switch (action) {
      case 'remove':
        return (
          <MessageModalRemove onClosed={reset} id={message._id} isMe={isMe} />
        );
      case 'forward':
        return <ForwardModal message={message} onClosed={reset} />;

      default:
        return null;
    }
  }, [action, isMe, message]);

  return (
    <MessageActionsContext.Provider
      value={{
        onAction,
      }}
    >
      {children}
      {Modal}
    </MessageActionsContext.Provider>
  );
};
