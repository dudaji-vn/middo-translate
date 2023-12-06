import { ChatBoxFooter } from '@/features/chat/rooms/components/chat-box/footer';
import { ChatBoxHeader } from '@/features/chat/rooms/components';
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
      <div className="flex-1"></div>
      <ChatBoxFooter />
    </div>
  );
};

export default ChatRoomPage;
