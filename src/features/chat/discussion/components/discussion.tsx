import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useRef } from 'react';
import { messageApi } from '../../messages/api';
import { DiscussionForm } from './discussion-form';
import { DiscussionSocket } from './discussion-socket';
import { MainMessage } from './main-message';
import { RepliesBox } from './replies-box';
import { Message } from '../../messages/types';
import { MessageActions } from '../../messages/components/message-actions';
import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import { FilePlus2Icon } from 'lucide-react';

type Props = {
  messageId: string;
};
interface DiscussionContextProps {
  message: Message;
  replies: Message[];
  addReply: (reply: Message) => void;
}

export const DiscussionContext = createContext<DiscussionContextProps>(
  {} as DiscussionContextProps,
);

const Discussion = ({ messageId }: Props) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['message', messageId],
    queryFn: () => messageApi.getOne(messageId),
    enabled: !!messageId,
  });
  const repliesKey = ['message-replies', messageId];
  const queryClient = useQueryClient();
  const { data: messages } = useQuery({
    queryKey: repliesKey,
    queryFn: () => messageApi.getReplies(messageId),
    keepPreviousData: true,
    enabled: !!messageId,
  });

  const addReply = (reply: Message) => {
    queryClient.setQueryData(repliesKey, (old: any) => [...old, reply]);
  };

  useEffect(
    () => {
      if (messageBoxRef.current) {
        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
      }
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */,
    [messages],
  );
  if (!data) return null;
  return (
    <MediaUploadProvider>
      <MessageActions>
        <DiscussionContext.Provider
          value={{
            message: data,
            replies: messages || [],
            addReply,
          }}
        >
          <MediaUploadDropzone className='overflow-hidden" flex h-full flex-1 flex-col'>
            <div
              ref={messageBoxRef}
              className="flex flex-1 flex-col overflow-y-auto"
            >
              <MainMessage message={data} className="p-3" />
              <RepliesBox />
            </div>
            <DiscussionForm />
          </MediaUploadDropzone>
          <DiscussionSocket />
        </DiscussionContext.Provider>
      </MessageActions>
    </MediaUploadProvider>
  );
};

export const useDiscussion = () => {
  const context = useContext(DiscussionContext);
  if (!context) {
    throw new Error('useDiscussion must be used within DiscussionProvider');
  }
  return context;
};

export default Discussion;
