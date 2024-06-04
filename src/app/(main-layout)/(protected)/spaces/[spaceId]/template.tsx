'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { NavigationBreadcrumb } from '@/components/data-display/navigation-breadcrumb/navigation-breadcrumb';
import { Globe, HomeIcon, Space } from 'lucide-react';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { ROUTE_NAMES } from '@/configs/route-name';
import toast from 'react-hot-toast';
import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import { getRoomsFilterOptionsFromSpace } from '@/utils/get-rooms-filter-options';
import { useTranslation } from 'react-i18next';
import SpaceNavigator from '@/features/business-spaces/space-navigator/space-navigator';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data, isLoading } = useGetSpaceData({ spaceId });
  const { isOnBusinessChat } = useBusinessNavigationData();
  const { setFilterOptions } = useSpaceInboxFilterStore();
  const router = useRouter();

  const { setSpace } = useAuthStore();

  useEffect(() => {
    if (data) {
      setFilterOptions(getRoomsFilterOptionsFromSpace(data));
      setSpace(data);
    }
  }, [data, setFilterOptions, setSpace]);

  const handleRefresh = useCallback(() => {
    toast.loading('You has been removed from this space. Refreshing...');
    setTimeout(() => {
      router.push(ROUTE_NAMES.SPACES);
      toast.dismiss();
    }, 2000);
  }, [router]);

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.SPACE.REMOVE_MEMBER, handleRefresh);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.SPACE.REMOVE_MEMBER, handleRefresh);
    };
  }, [handleRefresh]);

  return (
    <div className="flex h-main-container-height w-full flex-col gap-0  overflow-y-hidden ">
      <SpaceNavigator />
      <div className="flex flex-row overflow-y-auto">
        <div
          className={cn('flex w-[74px] flex-col max-md:hidden', {
            invisible: isLoading || !data,
          })}
        >
          <BusinessSidebar space={data} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default SpaceTemplate;
