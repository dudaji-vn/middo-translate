'use client';

import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { usePlatformStore } from '@/features/platform/stores';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { cn } from '@/utils/cn';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { TBusinessExtensionData } from '../../help-desk/api/business.service';
import ChatSidebarHeader from './chat-sidebar-header';
import { ChatSidebarTabs } from './chat-sidebar-tabs';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

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
  const platform = usePlatformStore((state) => state.platform);
  const { setBusinessExtension } = useBusinessExtensionStore();
  const { isOnBusinessChat, isBusiness } = useBusinessNavigationData();

  useEffect(() => {
    if (spaceData) {
      setBusinessExtension(spaceData.extension);
    }
  }, [spaceData]);

  return (
    <>
      <div
        className={cn(
          'container-height relative flex w-full flex-col overflow-hidden border-r',
          { 'extension-container-height': isBusiness },
          { 'max-md:hidden ': isOnBusinessChat },
        )}
      >
        <ChatSidebarHeader />
        <ChatSidebarTabs>{children}</ChatSidebarTabs>
      </div>
    </>
  );
};
