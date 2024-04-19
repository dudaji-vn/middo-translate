'use client';

import { ChatMain } from '@/features/chat/components/chat-main';
import { ChatSidebar } from '@/features/chat/components/chat-sidebar';
import { FCMBackground } from '@/features/notification/components';
import { Fragment } from 'react';
import { Inbox } from '@/features/chat/rooms/components';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { FCMElectron } from '@/features/notification/components/fcm-electron';
import { useAppStore } from '@/stores/app.store';

export interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  const isMobile = useAppStore((state) => state.isMobile);

  return (
    <Fragment>
      <div className="disable-text-selection h-main-container-height">
        {isMobile ? (
          <>
            <ChatSidebar>
              <Inbox />
            </ChatSidebar>
            <ChatMain>{children}</ChatMain>
          </>
        ) : (
          <Allotment defaultSizes={[300, 800]}>
            <Allotment.Pane minSize={300} maxSize={600} preferredSize={420}>
              <ChatSidebar>
                <Inbox />
              </ChatSidebar>
            </Allotment.Pane>
            <Allotment.Pane>
              <ChatMain>{children}</ChatMain>
            </Allotment.Pane>
          </Allotment>
        )}
      </div>
      <FCMBackground />
      <FCMElectron />
    </Fragment>
  );
};

export default ChatLayout;
