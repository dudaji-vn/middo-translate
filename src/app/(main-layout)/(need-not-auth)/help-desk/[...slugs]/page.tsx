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
import { cookies } from 'next/headers';
import { Button } from '@/components/actions';
import StartAConversation from './_components/start-conversation/start-a-conversation';
import { notFound } from 'next/navigation';

async function getChatRoom(roomId: string, anonymousUserId: string) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/rooms/anonymous/${roomId}?userId=${anonymousUserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message)
    }
    return data?.data;
  }
  catch (error) {
    console.error('Error in get business info :>>', error)
    return undefined;
  }
}

const getBusinessInfomation = async (businessId: string): Promise<Room | undefined> => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/help-desk/business/' + businessId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message)
    }
    return data?.data;
  }
  catch (error) {
    console.error('Error in get business info', error)
    return undefined;
  }
}

const ChatBoxPage = async ({ params: { slugs } }: {
  params: {
    slugs: string[];
  };
  searchParams: any;
}) => {
  const [businessId, roomId, anonymousUserId] = slugs;
  const businessData = await getBusinessInfomation(businessId);
  if (!businessData) {
    return <div>Not Found</div>;
  }
  if (!roomId) {
    return (
      <StartAConversation businessData={businessData} />
    )
  }
  const room = await getChatRoom(roomId, anonymousUserId);
  if (!room || !room?._id || !anonymousUserId) {
    notFound();
  }
  const anonymousUser = room.participants.find((p: { _id: string }) => p._id === anonymousUserId);
  return (
    <div className="w-full container h-full">
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

export default ChatBoxPage;
