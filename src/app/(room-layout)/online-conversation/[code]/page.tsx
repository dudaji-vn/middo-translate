import './style.css';

import {
  BoxChat,
  Header,
  InputEditor,
  SideChat,
} from '@/components/online-conversation/chat';

import { ChatProvider } from '@/components/online-conversation/chat/chat-context';
import { getConversation } from '@/services/conversation';

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
    return <>hello</>;
  }
  return (
    <ChatProvider room={room}>
      <div className="chatScreenWrapper h-screen overflow-hidden">
        <Header />
        <div className="chatElementWrapper flex-1 overflow-hidden">
          <div className="chat">
            <BoxChat />
            <InputEditor />
          </div>
          <SideChat />
        </div>
      </div>
    </ChatProvider>
  );
}
