'use client';

import { useParams, usePathname } from 'next/navigation';

import ChatSidebarHeader from './chat-sidebar-header';
import { ChatSidebarTabs } from './chat-sidebar-tabs';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { TBusinessExtensionData } from '../../help-desk/api/business.service';


interface ChatSidebarProps {
  children: ReactNode;
  spaceData?: TBusinessExtensionData
}

export const ChatSidebar = ({
  children,
  spaceData,
}: ChatSidebarProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const pathName = usePathname();
  const params = useParams();
  const { isOnBusinessChat } = useBusinessNavigationData();
  const { setBusinessExtension } = useBusinessExtensionStore();
  const isInRoom =
    pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && !!params?.id;

  const showSide = (!isMobile || !isInRoom) && (!isOnBusinessChat || !isMobile);

  useEffect(() => {
    if (spaceData) {
      setBusinessExtension(spaceData);
    }
  }, [spaceData]);

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
