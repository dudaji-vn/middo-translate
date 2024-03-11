import {
    RoomSide,
  } from '@/features/chat/rooms/components';
  
  import { ChatBoxProvider } from '@/features/chat/rooms/contexts';
  
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
  
  const ChatBoxPage = async (props: {
    params: {
      id: string;
    };
  }) => {
    const room = await getChatRoom(props.params.id);
    if (!room) {
      return <div>Not Found</div>;
    }
  
    return (
      <ChatBoxProvider room={room}>
        <div className="flex h-full">
          <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg">
          </div>
          <RoomSide />
        </div>
      </ChatBoxProvider>
    );
  };
  
  export default ChatBoxPage;
  