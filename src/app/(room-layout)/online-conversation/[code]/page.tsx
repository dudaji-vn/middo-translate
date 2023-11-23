import './style.css';

import {
  BoxChat,
  Header,
  InputEditor,
  SideChat,
} from '@/components/online-conversation/chat';

import { BoxChatProvider } from '@/components/online-conversation/chat/box-chat-context';
import { ChatProvider } from '@/components/online-conversation/chat/chat-context';
import { ROUTE_NAMES } from '@/configs/route-name';
import { getConversation } from '@/services/conversation';
import { redirect } from 'next/navigation';

interface RoomConversationProps {
  params: {
    code: string;
  };
}
export const dynamic = 'force-dynamic';
export default async function RoomConversation({
  params,
}: RoomConversationProps) {
  const room = await getConversation(params.code);
  if (!room) {
    redirect(ROUTE_NAMES.ONLINE_CONVERSATION_NOT_FOUND);
  }
  return (
    <div className="chatScreenWrapper h-screen overflow-hidden">
      <ChatProvider room={room}>
        <Header />
        <div className="chatElementWrapper flex-1 overflow-hidden">
          <BoxChatProvider>
            <div className="chat">
              <BoxChat />
              <InputEditor />
            </div>
            <SideChat />
          </BoxChatProvider>
        </div>
      </ChatProvider>
    </div>
  );
}
