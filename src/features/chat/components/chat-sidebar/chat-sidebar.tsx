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
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { usePlatformStore } from '@/features/platform/stores';
import { cn } from '@/utils/cn';

interface ChatSidebarProps {
  children: ReactNode;
  spaceData?: {
    extension: TBusinessExtensionData;
  } & TSpace;
}

export const ChatSidebar = ({
  children,
  spaceData,
}: ChatSidebarProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const platform = usePlatformStore((state) => state.platform);
  const pathName = usePathname();
  const params = useParams();
  const { isOnBusinessChat } = useBusinessNavigationData();
  const { setBusinessExtension } = useBusinessExtensionStore();
  const isInRoom =
    pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && !!params?.id;

  const showSide = (!isMobile || !isInRoom) && (!isOnBusinessChat || !isMobile);

  useEffect(() => {
    if (spaceData) {
      setBusinessExtension(spaceData.extension);
    }
  }, [spaceData]);

  return (
    <>
      {showSide && (
        <div
          className={cn(
            'relative flex  w-full flex-col overflow-hidden border-r',
            platform === 'mobile' ? 'h-dvh' : 'h-main-container-height',
          )}
        >
          <ChatSidebarHeader />
          {/* TODO: UPDATE THIS */}
          <ChatSidebarTabs>{children}</ChatSidebarTabs>
        </div>
      )}
    </>
  );
};
