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
      <div className="chatScreenWrapper">
        <Header />
        <div className="chatElementWrapper">
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
