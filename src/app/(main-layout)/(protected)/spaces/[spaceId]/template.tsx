'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { ROUTE_NAMES } from '@/configs/route-name';
import toast from 'react-hot-toast';
import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import { getRoomsFilterOptionsFromSpace } from '@/utils/get-rooms-filter-options';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data, isLoading } = useGetSpaceData({ spaceId });
  const { setFilterOptions } = useSpaceInboxFilterStore();

  const { setSpace } = useAuthStore();
  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setFilterOptions(getRoomsFilterOptionsFromSpace(data));
      setSpace(data);
    }
  }, [data, setFilterOptions, setSpace]);

  const handleRedirectToHome = useCallback(() => {
    customToast.default('You has been removed from this space. Refreshing...');
    setTimeout(() => {
      router.push(ROUTE_NAMES.SPACES);
      toast.dismiss();
    }, 2000);
  }, [router]);

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.SPACE.REMOVE_MEMBER, handleRedirectToHome);
    socket.on(SOCKET_CONFIG.EVENTS.SPACE.UPDATE, handleRefresh);
    return () => {
      socket.off(
        SOCKET_CONFIG.EVENTS.SPACE.REMOVE_MEMBER,
        handleRedirectToHome,
      );
      socket.off(SOCKET_CONFIG.EVENTS.SPACE.UPDATE, handleRefresh);
    };
  }, [handleRedirectToHome, handleRefresh]);

  return (
    <div className="container-height w-full overflow-y-hidden ">
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
