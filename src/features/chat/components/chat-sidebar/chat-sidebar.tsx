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
  const { isOnBusinessChat, isBusiness } = useBusinessNavigationData();
  const { isOnStation } = useStationNavigationData();

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
        {!isOnBusinessChat && <StationNavigator className="w-full" />}
        <ChatSidebarHeader />
        <ChatSidebarTabs>{children}</ChatSidebarTabs>
      </div>
    </>
  );
};
