import {
  CopyIcon,
  DownloadIcon,
  ForwardIcon,
  MessageSquareQuoteIcon,
  PenIcon,
  PinIcon,
  PinOffIcon,
  TrashIcon,
} from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';

import { NEXT_PUBLIC_NAME } from '@/configs/env.public';
import { useClickReplyMessage } from '../hooks/use-click-reply-message';
import { useCopyMessage } from '../hooks/use-copy-message';
import { usePinMessage } from '../hooks/use-pin-message';
import { Message } from '../types';
import { ForwardModal } from './forward-modal';
import { MessageModalRemove } from './message-modal-remove';
import { IDownloadFile, downloadFiles } from '@/utils/download-file';

type Action =
  | 'remove'
  | 'pin'
  | 'reply'
  | 'copy'
  | 'forward'
  | 'none'
  | 'unpin'
  | 'edit'
  | 'download';
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
    label: 'CONVERSATION.COPY',
    icon: <CopyIcon />,
  },
  {
    action: 'reply',
    label: 'CONVERSATION.REPLY_IN_DISCUSSION',
    icon: <MessageSquareQuoteIcon />,
  },
  {
    action: 'download',
    label: 'COMMON.DOWNLOAD',
    icon: <DownloadIcon />,
  },
  {
    action: 'edit',
    label: 'COMMON.EDIT',
    icon: <PenIcon />,
  },
  {
    action: 'forward',
    label: 'CONVERSATION.FORWARD',
    icon: <ForwardIcon />,
    disabled: true,
  },
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
    action: 'remove',
    label: 'CONVERSATION.REMOVE',
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
  action?: Action;
  message?: Message | null;
  reset: () => void;
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
  const { pin } = usePinMessage();
  const onAction = ({ action, isMe, message }: OnActionParams) => {
    switch (action) {
      case 'copy':
        copyMessage(message);
        break;
      case 'reply':
        onClickReplyMessage(message._id);
        break;
      case 'pin':
        pin(message._id);
        break;
      case 'unpin':
        pin(message._id);
        break;
      case 'download':
        if (!message?.media) return;
        let files: IDownloadFile[] = []

        message.media.forEach((media) => {
          files.push({ url: media.url, fileName: media.name, mimeType: media.type });
        });

        downloadFiles(files);
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
        action,
        message,
        reset,
      }}
    >
      {children}
      {Modal}
    </MessageActionsContext.Provider>
  );
};
