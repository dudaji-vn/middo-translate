import './style.css';

import {
  BoxChat,
  Header,
  InputEditor,
  SideChat,
} from '@/components/online-conversation/chat';

import { ChatProvider } from '@/components/online-conversation/chat/chat-context';

interface RoomConversationProps {
  params: {
    code: string;
  };
}

export default async function RoomConversation({
  params,
}: RoomConversationProps) {
  return (
    <ChatProvider roomCode={params.code}>
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
