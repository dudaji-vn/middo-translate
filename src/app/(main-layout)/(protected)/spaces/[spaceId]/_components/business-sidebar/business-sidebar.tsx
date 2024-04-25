'use client';

import { Button, ButtonProps } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Sheet, SheetContent } from '@/components/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import { cn } from '@/utils/cn';
import { ESPaceRoles } from '../../settings/_components/space-setting/setting-items';
import {
  Archive,
  CheckSquare,
  LineChartIcon,
  MessagesSquare,
  Settings,
} from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth.store';
import { getUserSpaceRole } from '../../settings/_components/space-setting/role.util';

interface SidebarContent {
  title: string;
  icon: React.ReactNode;
}

const sidebarContents: Array<{
  title: string;
  icon: React.ReactNode;
  roles?: ESPaceRoles[];
}> = [
  {
    title: 'conversations',
    icon: <MessagesSquare />,
  },
  {
    title: 'archived',
    icon: <Archive />,
  },
  {
    title: 'statistics',
    icon: <LineChartIcon />,
  },
  {
    title: 'settings',
    icon: <Settings />,
    roles: [ESPaceRoles.Admin, ESPaceRoles.Owner],
  },
];
const sidebarContentMeappedStyles: Record<string, ButtonProps['className']> = {
  settings: 'max-md:hidden',
};

const BusinessSidebarContent = ({
  shrink,
  onSelectChange,
  selectedItem,
  notifications,
}: {
  shrink: boolean;
  selectedItem?: {
    title: string;
    icon: React.ReactNode;
  };
  onSelectChange: (item: { title: string; icon: React.ReactNode }) => void;
  notifications?: { [key: string]: number };
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex w-fit flex-col items-start justify-start">
      {sidebarContents.map(({ icon, title }, index) => {
        const isSelected = selectedItem?.title === title;
        const displayTitle = shrink
          ? title
          : t(`business.${title}`.toUpperCase());
        return (
          <Button
            shape={'square'}
            variant={'ghost'}
            color={'default'}
            key={index}
            className={cn(
              'flex w-full flex-row items-center justify-start gap-2 rounded-none p-5 text-left transition-all duration-200 hover:bg-primary-300 [&_svg]:h-5 [&_svg]:w-5',
              isSelected
                ? 'bg-primary-500-main hover:!bg-primary-500-main [&_svg]:stroke-white'
                : 'hover:bg-primary-300',
              sidebarContentMeappedStyles[title] || '',
            )}
            onClick={() => onSelectChange({ icon, title })}
          >
            {icon}
            <Typography
              className={cn(
                shrink
                  ? 'w-0  scale-y-0 transition duration-100 ease-in-out md:invisible'
                  : 'min-w-[100px] capitalize transition duration-300 ease-in-out',
                isSelected ? 'text-white ' : 'text-neutral-600',
              )}
            >
              {displayTitle}
            </Typography>
            {notifications?.[title] && notifications[title] > 0 && (
              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-primary-500-main">
                <Typography className="text-white">
                  {notifications[title]}
                </Typography>
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
};

const BusinessSidebar = () => {
  const { isMobile } = useAppStore();
  const { openSidebar, setOpenSidebar, expand, setExpandSidebar } =
    useSidebarStore();

  //   const currentUser = useAuthStore((s) => s.user);
  //     const myRole = getUserSpaceRole(currentUser, space);

  const params = useParams();
  const pathname = usePathname();
  const [sellected, setSellected] = useState<SidebarContent | undefined>(
    sidebarContents.find((item) => pathname?.includes(`/${item.title}`)) ||
      undefined,
  );
  const router = useRouter();
  const expandSheet = () => {
    setExpandSidebar(true);
  };
  const shinkSheet = () => {
    setExpandSidebar(false);
  };
  const onSelectedChange = (item: { title: string; icon: React.ReactNode }) => {
    const spaceId = params?.spaceId;
    if (!spaceId) return;
    const nextPath = `${ROUTE_NAMES.SPACES}/${spaceId}/${item.title}`;
    router.push(nextPath);
  };
  useEffect(() => {
    setOpenSidebar(!isMobile, false);
    setSellected(
      sidebarContents.find((item) => pathname?.includes(`/${item.title}`)) ||
        undefined,
    );
  }, [params]);

  useEffect(() => {}, [openSidebar]);

  if (pathname?.endsWith('/spaces')) {
    return null;
  }
  return (
    <div className={cn('w-[74px] max-md:hidden')}>
      <Sheet
        open={isMobile ? openSidebar : true}
        modal={isMobile}
        onOpenChange={setOpenSidebar}
      >
        <div
          className={cn('relative h-full w-full max-md:hidden')}
          onMouseEnter={expandSheet}
        >
          <SheetContent
            overlayProps={{ className: ' top-[51px]' }}
            side={'left'}
            className="bottom-0  top-[51px]  w-fit p-0 backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          >
            <div className="h-full  w-full" onMouseLeave={shinkSheet}>
              <BusinessSidebarContent
                shrink={!expand}
                selectedItem={sellected}
                onSelectChange={onSelectedChange}
              />
            </div>
          </SheetContent>
        </div>
      </Sheet>
    </div>
  );
};

export default BusinessSidebar;
