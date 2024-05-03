import { ChatBoxProvider } from '@/features/chat/rooms/contexts';

import { Response } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { fetchApi } from '@/utils/data-fetching';
import { redirect } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import ChatRoomContent from './_component/chat-room-content';

async function getChatRoom(id: string) {
  const data = await fetchApi<Response<Room>>(`/rooms/${id}`);
  if (!data) {
    throw new Error('Not Found');
  }
  return data.data;
}

const ChatBoxPage = async (props: {
  params: {
    id: string;
  };
}) => {
  const room = await getChatRoom(props.params.id);

  if (!room || room.isHelpDesk) {
    return redirect(ROUTE_NAMES.ONLINE_CONVERSATION);
  }
  return (
    <ChatBoxProvider room={room}>
      <ChatRoomContent room={room} />
    </ChatBoxProvider>
  );
};

export default ChatBoxPage;
