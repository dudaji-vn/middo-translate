import { ChatBoxFooter, ChatBoxHeader } from '@/features/chat/rooms/components';

import { ChatBoxProvider } from '@/features/chat/rooms/contexts';
import { MessageBox } from '@/features/chat/messages/components/message-box';
import { MessagesBoxProvider } from '@/features/chat/messages/contexts';
import { Response } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { fetchApi } from '@/utils/data-fetching';

async function getChatRoom(id: string) {
  const data = await fetchApi<Response<Room>>(`/rooms/${id}`);
  if (!data) {
    throw new Error('Not Found');
  }
  return data.data;
}

const ChatRoomPage = async (props: {
  params: {
    id: string;
  };
}) => {
  const room = await getChatRoom(props.params.id);
  if (!room) {
    return <div>Not Found</div>;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-card">
      <ChatBoxHeader room={room} />
      <ChatBoxProvider room={room}>
        <MessagesBoxProvider room={room}>
          <MessageBox room={room} />
          <ChatBoxFooter />
        </MessagesBoxProvider>
      </ChatBoxProvider>
    </div>
  );
};

export default ChatRoomPage;
