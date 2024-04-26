'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { NavigationBreadcrumb } from '@/components/data-display/navigation-breadcrumb/navigation-breadcrumb';
import { HomeIcon } from 'lucide-react';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data, isLoading } = useGetSpaceData({ spaceId });
  const { isOnBusinessChat } = useBusinessNavigationData();
  const pathname = usePathname();

  const { setSpace } = useAuthStore();
  const breadcrumbItems = useMemo(() => {
    return [
      {
        label: 'Home',
        path: '/spaces',
        href: '/spaces',
        icon: <HomeIcon />,
      },
      {
        label: (
          <span className="font-semibold text-neutral-800 ">{data?.name}</span>
        ),
        path: `/spaces/${spaceId}`,
        href: `/spaces/${spaceId}/conversations`,
      },
    ].filter((item) => pathname?.includes(item.path));
  }, [pathname, data, spaceId]);

  useEffect(() => {
    if (data) {
      setSpace(data);
    }
  }, [data, setSpace]);

  return (
    <div className="flex h-main-container-height w-full flex-col gap-0  overflow-y-hidden ">
      <NavigationBreadcrumb
        items={breadcrumbItems}
        className={cn({ 'max-md:hidden': isOnBusinessChat })}
      />
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
