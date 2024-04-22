'use client';

import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { Inbox } from '@/features/chat/rooms/components';
import { useAppStore } from '@/stores/app.store';
import { EBusinessConversationKeys } from '@/types/business.type';
import { Allotment } from 'allotment';
import { ChatSidebar } from '@/features/chat/components/chat-sidebar';

export default function ConversationLayout({
  children,
  spaceData,
}: {
  children: React.ReactNode;
  spaceData: any;
}) {
  const isMobile = useAppStore((state) => state.isMobile);
  return (
    <div className="disable-text-selection h-main-container-height">
      {isMobile ? (
        <>
          <ChatSidebar spaceData={spaceData}>
            <Inbox />
          </ChatSidebar>
          {children}
        </>
      ) : (
        <Allotment defaultSizes={[300, 600]} vertical={false}>
          <Allotment.Pane minSize={300} maxSize={600} preferredSize={420}>
            <ChatSidebar spaceData={spaceData}>
              <Inbox />
            </ChatSidebar>
          </Allotment.Pane>
          <Allotment.Pane>
            {children}
          </Allotment.Pane>
        </Allotment>
      )}
    </div>
  );
}
