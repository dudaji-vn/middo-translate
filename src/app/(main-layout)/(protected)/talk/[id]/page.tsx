import {
  ChatBoxFooter,
  ChatBoxHeader,
  RoomSide,
} from '@/features/chat/rooms/components';

import { ChatBoxProvider } from '@/features/chat/rooms/contexts';
import {
  MessageBox,
  MessagesBoxProvider,
} from '@/features/chat/messages/components/message-box';

import { Response } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { fetchApi } from '@/utils/data-fetching';
import { PinnedBar } from '@/features/chat/rooms/components/pin-message-bar';
import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import { redirect } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { RoomTyping } from '@/features/chat/rooms/components/room-box/room-typing';

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
    return redirect(ROUTE_NAMES.ONLINE_CONVERSATION);
  }
  return (
    <ChatBoxProvider room={room}>
      <div className="flex h-full">
        <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card">
          <ChatBoxHeader />
          <PinnedBar />
          <MediaUploadProvider>
            <MediaUploadDropzone>
              <MessagesBoxProvider room={room}>
                <MessageBox room={room} />
                <RoomTyping />
                <ChatBoxFooter />
              </MessagesBoxProvider>
            </MediaUploadDropzone>
          </MediaUploadProvider>
        </div>
        <RoomSide />
      </div>
    </ChatBoxProvider>
  );
};

export default ChatBoxPage;
