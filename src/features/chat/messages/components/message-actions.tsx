import {
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  ForwardIcon,
  Globe,
  MessageSquareQuoteIcon,
  PenIcon,
  PinIcon,
  PinOffIcon,
  TrashIcon,
} from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';

import { IDownloadFile, downloadFiles } from '@/utils/download-file';
import { useClickReplyMessage } from '../hooks/use-click-reply-message';
import { useCopyMessage } from '../hooks/use-copy-message';
import { usePinMessage } from '../hooks/use-pin-message';
import { Message } from '../types';
import { ForwardModal } from './forward-modal';
import { MessageModalRemove } from './message-modal-remove';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';

type Action =
  | 'remove'
  | 'pin'
  | 'reply'
  | 'copy'
  | 'forward'
  | 'none'
  | 'unpin'
  | 'edit'
  | 'browser'
  | 'download'
  | 'view-original'
  | 'copy-original'
  | 'view-translated'
  | 'copy-translated'
  | 'copy-english';
export type MessageActionItem = {
  action: Action;
  label: string;
  icon: JSX.Element;
  color?: string;
  disabled?: boolean;
  separator?: boolean;
};
export const actionItems: MessageActionItem[] = [
  {
    action: 'view-original',
    label: 'CONVERSATION.VIEW_ORIGINAL',
    icon: <EyeIcon />,
    separator: true,
  },
  {
    action: 'copy',
    label: 'CONVERSATION.COPY',
    icon: <CopyIcon />,
  },
  {
    action: 'copy-english',
    label: 'CONVERSATION.COPY_ESL',
    icon: <CopyIcon />,
  },
  {
    action: 'copy-original',
    label: 'CONVERSATION.COPY_ORIGINAL',
    icon: <CopyIcon />,
    separator: true,
  },
  {
    action: 'copy-translated',
    label: 'CONVERSATION.COPY_TRANSLATED',
    icon: <CopyIcon />,
    separator: true,
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
    action: 'browser',
    label: 'CONVERSATION.OPEN_IN_BROWSER',
    icon: <Globe />,
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
    separator: true,
  },
  {
    action: 'unpin',
    label: 'CONVERSATION.UNPIN',
    icon: <PinOffIcon />,
    separator: true,
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
  const { copyMessage, copyHtml } = useCopyMessage();
  const { onClickReplyMessage } = useClickReplyMessage();
  const { pin } = usePinMessage();
  const { postMessage } = useReactNativePostMessage();
  const onAction = ({ action, isMe, message }: OnActionParams) => {
    switch (action) {
      case 'copy':
      case 'copy-translated':
        copyMessage(message);
        break;
      case 'copy-original':
        copyMessage(message, true);
        break;
      case 'copy-english':
        copyHtml(message.translations?.en || message.content);
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
        let files: IDownloadFile[] = [];

        message.media.forEach((media) => {
          files.push({
            url: media.url,
            fileName: media.name,
            mimeType: media.type,
          });
        });

        postMessage({
          type: 'Trigger',
          data: {
            event: 'download',
            payload: files.map((file) => ({
              url: file.url,
              name: file.fileName,
              type: file.mimeType,
            })),
          },
        });

        downloadFiles(files);
        break;
      case 'browser':
        postMessage({
          type: 'Trigger',
          data: {
            event: 'link',
            payload: {
              url: message.media?.[0].url,
            },
          },
        });
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
