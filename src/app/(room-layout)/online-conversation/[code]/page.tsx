import './style.css';

import {
  BoxChat,
  Header,
  InputEditor,
  SideChat,
} from '@/components/online-conversation/chat';

import { ChatProvider } from '@/components/online-conversation/chat/chat-context';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
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
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <img src="/not-found.png" alt="not-found" width={224} />
        <h3 className="mt-8">Room not found!!!</h3>
        <p className="mt-3">
          Please check again or return to homepage to create a new room
        </p>
        <Link href={`${ROUTE_NAMES.ONLINE_CONVERSATION}`} className="mt-10">
          <button className="font-medium text-primary">
            Return to homepage
          </button>
        </Link>
      </div>
    );
  }
  return (
    <div className="chatScreenWrapper h-screen overflow-hidden">
      <ChatProvider room={room}>
        <Header />
        <div className="chatElementWrapper flex-1 overflow-hidden">
          <div className="chat">
            <BoxChat />
            <InputEditor />
          </div>
          <SideChat />
        </div>
      </ChatProvider>
    </div>
  );
}
