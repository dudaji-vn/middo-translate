'use client';

import { Blocks, Minus } from 'lucide-react';
import { Typography } from '@/components/data-display';
import { navLandingPageItems } from '@/components/layout/header/header.config';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import useClient from '@/hooks/use-client';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderNav } from './header-nav';
import HeaderProfile from './header-profile';
import HelpDeskDropdownMenu from './help-desk-dropdown-menu';
import { HeaderNavMobile } from './header-nav.mobile';
import { usePlatformStore } from '@/features/platform/stores';
import { NavItem } from './nav-item';
import { usePathname } from 'next/navigation';

type Props = {};

export const HeaderLandingPage = (props: Props) => {
  const isClient = useClient();
  const platform = usePlatformStore((state) => state.platform);
  const pathName = usePathname();
  if (!isClient) return null;
  if (platform === 'mobile') return null;
  const isCurrentPath = (href: string) =>
  href == ROUTE_NAMES.ROOT
    ? pathName === ROUTE_NAMES.ROOT
    : pathName?.includes(href);
  return (
    <div
      className={cn(
        'z-50 flex h-header w-full items-center justify-between gap-1 md:gap-5 border-b border-neutral-50 py-4  pl-[1vw] pr-[5vw] md:pl-[5vw] bg-primary-100 relative',
      )}
    >
      <HeaderNavMobile />
      <Link
        href={ ROUTE_NAMES.ROOT}
        className={cn(
          'flex w-[60px] flex-row justify-start gap-2 divide-x-[2px] divide-neutral-900',
        )}
      >
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
      </Link>

      <div className={cn("flex-1 z-0")}>
          <div className="md:flex w-screen flex-row items-stretch md:gap-1 lg:gap-5 shadow-none md:!ml-0 md:w-auto md:items-center justify-center hidden">
          {navLandingPageItems.map((item) => {
              return <NavItem
                      isActive={isCurrentPath(item.href)}
                      key={item.name}
                      item={item}
                    />
            })}
          </div>
      </div>
      <HeaderProfile />
    </div>
  );
};
