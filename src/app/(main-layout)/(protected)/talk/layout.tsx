import { AnimatePresence } from 'framer-motion';
import { ChatLeftSide } from '@/features/chat/components/chat-left-side';
import { ChatMain } from '@/features/chat/components/chat-main';
import { Inbox } from '@/features/chat/rooms/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talk',
};
export interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex h-main-container-height overflow-hidden">
      <ChatLeftSide>
        <Inbox />
      </ChatLeftSide>
      <ChatMain>{children}</ChatMain>
    </div>
  );
};

export default ChatLayout;
