'use client';

import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { cn } from '@/utils/cn';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { TBusinessExtensionData } from '../../help-desk/api/business.service';
import ChatSidebarHeader from './chat-sidebar-header';
import { ChatSidebarTabs } from './chat-sidebar-tabs';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useStationNavigationData } from '@/hooks';
import StationNavigator from '@/app/(main-layout)/(protected)/stations/[stationId]/_components/station-navigator/station-navigator';
import { Button } from '@/components/actions';
import { Settings } from 'lucide-react';
import SpaceNavigator from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/space-navigator/space-navigator';
import { useAppStore } from '@/stores/app.store';

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
  const { setBusinessExtension } = useBusinessExtensionStore();
  const isMobile = useAppStore((state) => state.isMobile);
  const { isOnBusinessChat, isBusiness } = useBusinessNavigationData();

  useEffect(() => {
    if (spaceData) {
      setBusinessExtension(spaceData.extension);
    }
  }, [setBusinessExtension, spaceData]);

  return (
    <>
      <div
        className={cn(
          'container-height relative flex w-full flex-col overflow-hidden border-r dark:border-neutral-800',
          { 'container-height': isBusiness },
          { 'max-md:hidden ': isOnBusinessChat },
        )}
      >
        {!isBusiness && <StationNavigator className="w-full" />}
        {isBusiness && isMobile && <SpaceNavigator />}
        <ChatSidebarHeader />
        <ChatSidebarTabs>{children}</ChatSidebarTabs>
      </div>
    </>
  );
};
