import './style.css';

import {
  BoxChat,
  Header,
  InputEditor,
  SideChat,
} from '@/components/online-conversation/chat';

import { ChatProvider } from '@/components/online-conversation/chat/chat-context';
import { ROUTE_NAMES } from '@/configs/route-name';
import { getConversation } from '@/services/conversation';
import { redirect } from 'next/navigation';

interface HomeProps {
  params: {
    code: string;
  };
}

export default async function Home({ params }: HomeProps) {
  const room = await getConversation(params.code);
  console.log(room);
  if (!room) redirect(ROUTE_NAMES.ONLINE_CONVERSATION);

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
