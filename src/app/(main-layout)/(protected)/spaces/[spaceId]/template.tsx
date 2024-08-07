'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useParams } from 'next/navigation';
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
import usePlatformNavigation from '@/hooks/use-platform-navigation';
import SpaceNavigator from './_components/space-navigator/space-navigator';
import { useExtensionFormsStore } from '@/stores/forms.store';
import { useGetFormsNames } from '@/features/conversation-forms/hooks/use-get-forms-names';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data, isLoading } = useGetSpaceData({ spaceId });
  const { setFormsInfo } = useExtensionFormsStore();
  const { data: namesOfForms } = useGetFormsNames({
    spaceId,
  });
  const { setFilterOptions } = useSpaceInboxFilterStore();

  const { setSpace } = useAuthStore();
  const { t } = useTranslation('common');

  const { navigateTo, router } = usePlatformNavigation();

  useEffect(() => {
    if (data?._id) {
      setFilterOptions(getRoomsFilterOptionsFromSpace(data));
      setSpace(data);
    }
  }, [data, setFilterOptions, setSpace]);

  const handleRedirectToHome = useCallback(() => {
    customToast.default('You has been removed from this space. Refreshing...');
    setTimeout(() => {
      navigateTo(ROUTE_NAMES.SPACES);
      toast.dismiss();
    }, 2000);
  }, [router]);

  const handleRefresh = useCallback(() => {
    customToast.default('The space has been updated. Refreshing...');
    setTimeout(() => {
      router.refresh();
      toast.dismiss();
    }, 2000);
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

  useEffect(() => {
    if (namesOfForms) {
      setFormsInfo(namesOfForms);
    }
  }, [namesOfForms, setFormsInfo]);

  return (
    <div className="h-full w-full overflow-y-hidden ">
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
