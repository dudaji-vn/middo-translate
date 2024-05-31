'use client';

import { navLandingPageItems } from '@/components/layout/header/header.config';
import { ROUTE_NAMES } from '@/configs/route-name';
import useClient from '@/hooks/use-client';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import HeaderProfile from './header-profile';

import { usePlatformStore } from '@/features/platform/stores';
import { NavItem } from './nav-item';
import { usePathname } from 'next/navigation';
import { HeaderNavLandingMobile } from './header-nav-landing.mobile';
import { useAppStore } from '@/stores/app.store';

type Props = {};

export const HeaderLandingPage = (props: Props) => {
  const isClient = useClient();
  const platform = usePlatformStore((state) => state.platform);
  const pathName = usePathname();
  const isMobile = useAppStore((state) => state.isMobile);
  if (!isClient) return null;
  if (platform === 'mobile') return null;

  const isCurrentPath = (href: string) =>
    href == ROUTE_NAMES.ROOT
      ? pathName === ROUTE_NAMES.ROOT
      : pathName?.includes(href);

  return (
    <div
      className={cn(
        'relative z-50 flex h-header w-full items-center justify-between gap-1 border-b border-neutral-50 bg-primary-100  py-4 pl-[1vw] pr-[5vw] md:gap-5 md:pl-[5vw]',
      )}
    >
      {isMobile && <HeaderNavLandingMobile navItems={navLandingPageItems} />}
      <Link
        href={ROUTE_NAMES.ROOT}
        className={cn(
          'flex w-[60px] flex-row justify-start gap-2 divide-x-[2px] divide-neutral-900',
        )}
      >
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
      </Link>
      <div className={cn('z-0 flex-1')}>
        <div className="hidden w-screen flex-row items-stretch justify-center shadow-none md:!ml-0 md:flex md:w-auto md:items-center md:gap-1 lg:gap-5">
          {navLandingPageItems.map((item) => {
            return (
              <NavItem
                isActive={isCurrentPath(item.href)}
                key={item.name}
                item={item}
              />
            );
          })}
        </div>
      </div>
      <HeaderProfile />
    </div>
  );
};
