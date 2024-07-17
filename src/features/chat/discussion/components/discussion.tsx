import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useId, useRef } from 'react';
import { messageApi } from '../../messages/api';
import { MessageActions } from '../../messages/components/message-actions';
import { Message } from '../../messages/types';
import { DiscussionForm } from './discussion-form';
import { DiscussionSocket } from './discussion-socket';
import { MainMessage } from './main-message';
import { RepliesBox } from './replies-box';
import { useAuthStore } from '@/stores/auth.store';

type Props = {
  messageId: string;
  isAnonymous?: boolean;
};
interface DiscussionContextProps {
  message: Message;
  replies: Message[];
  addReply: (reply: Message) => void;
  replaceReply: (reply: Message, replaceId: string) => void;
  updateReply: (reply: Message) => void;
}

export const DiscussionContext = createContext<DiscussionContextProps>(
  {} as DiscussionContextProps,
);

const Discussion = ({ messageId, isAnonymous }: Props) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const messageBoxId = useId();
  const user = useAuthStore((state) => state.user);
  const { data } = useQuery({
    queryKey: ['message', messageId],
    queryFn: () => isAnonymous ? messageApi.getOneAnonymous(messageId, user?._id || '' ) : messageApi.getOne(messageId),
    enabled: !!messageId,
  });

  const repliesKey = ['message-replies', messageId];
  const queryClient = useQueryClient();
  const { data: messages } = useQuery({
    queryKey: repliesKey,
    queryFn: () => isAnonymous ? messageApi.getRepliesAnonymous(messageId, user?._id || '' ) : messageApi.getReplies(messageId),
    keepPreviousData: true,
    enabled: !!messageId,
  });
  

  const addReply = (reply: Message) => {
    queryClient.setQueryData<typeof messages | undefined>(repliesKey, (old) =>
      old ? [...old, reply] : [reply],
    );
  };

  const replaceReply = (reply: Message, replaceId: string) => {
    queryClient.setQueryData(repliesKey, (old: any) => {
      let isReplaced = false;
      const newMessages = old?.map((m: Message) => {
        if (m._id === replaceId) {
          isReplaced = true;
          return {
            ...m,
            ...reply,
          };
        }
        return m;
      });
      if (!isReplaced) {
        newMessages?.push(reply);
      }
      return newMessages;
    });
  };

  const updateReply = (reply: Message) => {
    queryClient.setQueryData(repliesKey, (old: any) =>
      old.map((m: Message) =>
        m._id === reply._id
          ? {
              ...m,
              ...reply,
            }
          : m,
      ),
    );
  };
  if (!data) return null;
  return (
    <MediaUploadProvider>
      <MessageActions>
        <DiscussionContext.Provider
          value={{
            message: data,
            replies: messages || [],
            addReply,
            replaceReply,
            updateReply,
          }}
        >
          <MediaUploadDropzone className='overflow-hidden" flex h-full flex-1 flex-col'>
            <div
              ref={messageBoxRef}
              id={messageBoxId}
              className="flex flex-1 flex-col overflow-y-auto"
            >
              <MainMessage message={data} className="p-3" />
              <RepliesBox />
            </div>
            <DiscussionForm scrollId={messageBoxId}/>
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
