import { ChatMain } from '@/features/chat/components/chat-main';
import { ChatSidebar } from '@/features/chat/components/chat-sidebar';
import { FCMBackground } from '@/features/notification/components';
import { Fragment } from 'react';
import { Inbox } from '@/features/chat/rooms/components';
import { Metadata } from 'next';
import CallVideoModalContainer from '@/features/call/components';

export const metadata: Metadata = {
  title: 'Talk',
};
export interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <Fragment>
      <div className="flex">
        <ChatSidebar>
          <Inbox />
        </ChatSidebar>
        <ChatMain>{children}</ChatMain>
      </div>
      <FCMBackground />
      <CallVideoModalContainer />
    </Fragment>
  );
};

export default ChatLayout;
