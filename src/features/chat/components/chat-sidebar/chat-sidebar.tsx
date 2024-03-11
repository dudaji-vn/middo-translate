'use client';

import { useParams, usePathname } from 'next/navigation';

import ChatSidebarHeader from './chat-sidebar-header';
import { ChatSidebarTabs } from './chat-sidebar-tabs';
import { PropsWithChildren } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';

interface ChatSidebarProps { }

export const ChatSidebar = ({
  children,
}: ChatSidebarProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const pathName = usePathname();
  const params = useParams();

  const isInRoom =
    pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && !!params?.id;

  const showSide = !isMobile || !isInRoom;
  return (
    <>
      {showSide && (
        <div className="relative flex h-main-container-height w-full min-w-[320px] flex-col overflow-hidden border-r md:w-[26.5rem]">
          <ChatSidebarHeader />
          <ChatSidebarTabs>{children}</ChatSidebarTabs>
        </div>
      )}
    </>
  );
};
