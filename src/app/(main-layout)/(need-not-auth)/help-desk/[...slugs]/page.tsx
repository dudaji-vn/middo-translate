import {
  ChatBoxFooter,
  RoomSide,
} from '@/features/chat/rooms/components';

import { ChatBoxProvider } from '@/features/chat/rooms/contexts';
import {
  MessageBox,
  MessagesBoxProvider,
} from '@/features/chat/messages/components/message-box';


import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import StartAConversation from './_components/start-conversation/start-a-conversation';
import { notFound } from 'next/navigation';
import { businessAPI } from '@/features/chat/business/business.service';



const HelpDeskConversationPage = async ({ params: { slugs } }: {
  params: {
    slugs: string[];
  };
  searchParams: any;
}) => {
  const [businessId, roomId, anonymousUserId] = slugs;
  const businessData = await businessAPI.getBusinessInfomation(businessId);
  if (!businessData) {
    return <div>Not Found</div>;
  }
  if (!roomId) {
    return (
      <StartAConversation businessData={businessData} />
    )
  }
  const room = await businessAPI.getChatRoom(roomId, anonymousUserId);
  if (!room || !room?._id || !anonymousUserId) {
    notFound();
  }
  const anonymousUser = room.participants.find((p: { _id: string }) => p._id === anonymousUserId);
  return (
    <div className="w-full h-full">
      <ChatBoxProvider room={room}>
        <div className="flex h-full">
          <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card">
            <MediaUploadProvider>
              <MediaUploadDropzone>
                <MessagesBoxProvider room={room} guestId={anonymousUserId} isAnonymous>
                  <MessageBox room={room} isAnonymous guestId={anonymousUserId} />
                  <ChatBoxFooter isAnonymous guest={anonymousUser} />
                </MessagesBoxProvider>
              </MediaUploadDropzone>
            </MediaUploadProvider>
          </div>
          <RoomSide />
        </div>
      </ChatBoxProvider>
    </div>
  );
};

export default HelpDeskConversationPage;
