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

type Props = {};

export const Header = (props: Props) => {
  const isClient = useClient();
  const { isBusiness, isHelpDesk, isTestItOutPage } = useBusinessNavigationData();
  const hideNavigation = isBusiness || isHelpDesk;

  if (!isClient) return null;

  return (
    <div
      className={cn(
        'z-50 flex h-header w-full items-center justify-between gap-5 border-b border-neutral-50 bg-background py-4  pl-[1vw] pr-[5vw] md:pl-[5vw]'
      )}
    >
      {!hideNavigation && <HeaderNavMobile />}
      
      <Link
        href={isHelpDesk ? '#' : ROUTE_NAMES.ROOT}
        className={cn(
          'w-[60px] flex flex-row justify-start gap-2 divide-x-[2px] divide-neutral-900',
        )}
      >
        {isHelpDesk && (
          <Typography className={' ml-5 min-w-14 text-xs text-neutral-600'}>
            Power by
          </Typography>
        )}
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
