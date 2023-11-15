import './style.css';

import {
  BoxChat,
  Header,
  InputEditor,
  SideChat,
} from '@/components/online-conversation/chat';

import { ChatProvider } from '@/components/online-conversation/chat/chat-context';
import { ROUTE_NAMES } from '@/configs/route-name';
import { getConversationWithUserSocketId } from '@/services/conversation';
import { redirect } from 'next/navigation';
import { useSessionStore } from '@/stores/session';

interface HomeProps {
  params: {
    code: string;
  };
}

export default async function Home({ params }: HomeProps) {
  const sessionId = useSessionStore.getState().sessionId;

  if (!sessionId)
    redirect(ROUTE_NAMES.ONLINE_CONVERSATION_JOIN + '/' + params.code);

  const room = await getConversationWithUserSocketId(params.code, sessionId);

  if (!room) redirect(ROUTE_NAMES.ONLINE_CONVERSATION_JOIN + '/' + params.code);

  return (
    <ChatProvider room={room}>
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
