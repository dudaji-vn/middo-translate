import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useRef } from 'react';
import { messageApi } from '../../messages/api';
import { DiscussionForm } from './discussion-form';
import { DiscussionSocket } from './discussion-socket';
import { MainMessage } from './main-message';
import { RepliesBox } from './replies-box';
import { Message } from '../../messages/types';
import { MessageActions } from '../../messages/components/message-actions';

type Props = {
  messageId: string;
};
interface DiscussionContextProps {
  message: Message;
  replies: Message[];
}

export const DiscussionContext = createContext<DiscussionContextProps>(
  {} as DiscussionContextProps,
);

const Discussion = ({ messageId }: Props) => {
  const { data } = useQuery({
    queryKey: ['message', messageId],
    queryFn: () => messageApi.getOne(messageId),
    enabled: !!messageId,
  });
  const { data: messages } = useQuery({
    queryKey: ['message-replies', messageId],
    queryFn: () => messageApi.getReplies(messageId),
    keepPreviousData: true,
    enabled: !!messageId,
  });

  const messageBoxRef = useRef<HTMLDivElement>(null);

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
    <MessageActions>
      <DiscussionContext.Provider
        value={{
          message: data,
          replies: messages || [],
        }}
      >
        <div className="flex h-full flex-1 flex-col overflow-hidden p-1">
          <div
            ref={messageBoxRef}
            className="flex flex-1 flex-col overflow-y-auto pb-2"
          >
            <MainMessage />
            <RepliesBox />
          </div>
          <DiscussionForm />
        </div>
        <DiscussionSocket />
      </DiscussionContext.Provider>
    </MessageActions>
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
