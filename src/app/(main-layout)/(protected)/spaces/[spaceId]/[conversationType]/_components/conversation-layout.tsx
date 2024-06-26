'use client';

import { Inbox } from '@/features/chat/rooms/components';
import { useAppStore } from '@/stores/app.store';
import { Allotment } from 'allotment';
import { ChatSidebar } from '@/features/chat/components/chat-sidebar';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';

export default function ConversationLayout({
  children,
  spaceData,
}: {
  children: React.ReactNode;
  spaceData: any;
}) {
  const isMobile = useAppStore((state) => state.isMobile);
  const { businessConversationType } = useBusinessNavigationData();
  const pathname = usePathname();
  return (
    <div
      className={cn(
        'disable-text-selection  container-height overflow-y-hidden',
        {
          'max-md:container-height':
            isMobile &&
            businessConversationType &&
            !pathname?.endsWith(String(businessConversationType)),
        },
      )}
    >
      {isMobile ? (
        <>
          <ChatSidebar spaceData={spaceData}>
            <Inbox unreadCount={spaceData?.totalNewMessages} />
          </ChatSidebar>
          {children}
        </>
      ) : (
        <Allotment defaultSizes={[300, 600]} vertical={false}>
          <Allotment.Pane minSize={300} maxSize={600} preferredSize={420}>
            <ChatSidebar spaceData={spaceData}>
              <Inbox unreadCount={spaceData?.totalNewMessages} />
            </ChatSidebar>
          </Allotment.Pane>
          <Allotment.Pane>{children}</Allotment.Pane>
        </Allotment>
      )}
    </div>
  );
}
