'use client';

import { useParams, usePathname } from 'next/navigation';

import ChatSidebarHeader from './chat-sidebar-header';
import { ChatSidebarTabs } from './chat-sidebar-tabs';
import { PropsWithChildren, ReactNode } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';
import { TBusinessExtensionData } from '@/app/(main-layout)/(protected)/business/settings/_components/extenstion/business-extension';
import { PK_BUSINESS_CONVERSATIONS } from '@/types/business.type';
import { useBusiness } from '@/hooks/use-business';


interface ChatSidebarProps {
  children: ReactNode
}

export const ChatSidebar = ({
  children,
}: ChatSidebarProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const pathName = usePathname();
  const params = useParams();
  const { isOnBusinessChat } = useBusiness();
  const isInRoom =
    pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && !!params?.id;

  const showSide = (!isMobile || !isInRoom) && (!isOnBusinessChat || !isMobile);
  return (
    <>
      {showSide && (
        <div className="relative flex h-main-container-height w-full min-w-[320px] flex-col overflow-hidden border-r md:w-[26.5rem]">
          <ChatSidebarHeader />
          {/* TODO: UPDATE THIS */}
          <ChatSidebarTabs>{children}</ChatSidebarTabs>
        </div>
      )}

    </>
  );
};
