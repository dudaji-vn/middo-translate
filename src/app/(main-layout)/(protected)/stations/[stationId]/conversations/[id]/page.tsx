import { ChatBoxProvider } from '@/features/chat/rooms/contexts';

import { Response } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { fetchApi } from '@/utils/data-fetching';
import { redirect } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import ChatRoomContent from '@/app/(main-layout)/(protected)/talk/[id]/_component/chat-room-content';

async function getChatRoom(id: string, stationId: string) {
  const data = await fetchApi<Response<Room>>(
    `/rooms/${id}?stationId=${stationId}`,
  );
  if (!data) {
    throw new Error('Not Found');
  }
  return data.data;
}

const ChatBoxPage = async (props: {
  params: {
    id: string;
    stationId: string;
  };
}) => {
  const room = await getChatRoom(props.params.id, props.params.stationId);
  console.log(room);

  if (!room || room.isHelpDesk) {
    return redirect(ROUTE_NAMES.ONLINE_CONVERSATION);
  }
  return (
    <ChatBoxProvider room={room}>
      <ChatRoomContent />
    </ChatBoxProvider>
  );
};

export default ChatBoxPage;
