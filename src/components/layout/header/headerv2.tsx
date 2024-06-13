'use client';

import { Blocks, Minus } from 'lucide-react';
import { Typography } from '@/components/data-display';

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
import { useAppStore } from '@/stores/app.store';

type Props = {};

export const Header = (props: Props) => {
  const isClient = useClient();
  const platform = usePlatformStore((state) => state.platform);
  const theme = useAppStore((state) => state.theme);

  const { isBusiness } = useBusinessNavigationData();
  const hideNavigation = isBusiness;
  if (!isClient) return null;
  if (platform === 'mobile') return null;
  const logoURL = isBusiness
    ? '/power-by-middo.svg'
    : theme == 'light'
      ? '/logo.png'
      : '/logo-dark.png';

  return (
    <div
      className={cn(
        'flex h-header w-full items-center justify-between gap-1 border-b border-neutral-50 bg-primary-100 py-4  pl-[1vw] pr-[5vw] dark:border-neutral-800 dark:bg-neutral-900 md:gap-5 md:pl-[5vw]',
      )}
    >
      {!hideNavigation && <HeaderNavMobile />}
      <Link
        href={ROUTE_NAMES.ROOT}
        className={cn(
          'flex w-[60px] flex-row justify-start gap-2',
          isBusiness && 'w-[120px]',
        )}
      >
        <Image
          src={logoURL}
          priority
          alt="Middo logo"
          width={500}
          height={500}
        />
      </Link>
      {!hideNavigation && <HeaderNav />}
      <HeaderProfile />
    </div>
  );
};
