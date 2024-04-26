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

type Props = {};

export const Header = (props: Props) => {
  const isClient = useClient();
  const platform = usePlatformStore((state) => state.platform);

  const { isBusiness } =
    useBusinessNavigationData();
  const hideNavigation = isBusiness;

  if (!isClient) return null;
  if (platform === 'mobile') return null;

  return (
    <div
      className={cn(
        'z-50 flex h-header w-full items-center justify-between gap-1 md:gap-5 border-b border-neutral-50 py-4  pl-[1vw] pr-[5vw] md:pl-[5vw] bg-primary-100 fixed top-0 left-0 right-0',
      )}
    >
      {!hideNavigation && <HeaderNavMobile />}
      <Link
        href={ ROUTE_NAMES.ROOT}
        className={cn(
          'flex w-[60px] flex-row justify-start gap-2 divide-x-[2px] divide-neutral-900',
        )}
      >

        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
        {isBusiness && (
          <Typography
            className={
              'flex flex-row items-center pl-2 font-semibold text-primary-500-main'
            }
          >
            {' '}
            <Blocks /> Extension
          </Typography>
        )}
      </Link>

      {!hideNavigation && <HeaderNav />}
      <HeaderProfile />
    </div>
  );
};
