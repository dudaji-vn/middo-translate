'use client';

import { Typography } from '@/components/data-display';
import { Blocks } from 'lucide-react';

import { ROUTE_NAMES } from '@/configs/route-name';
import { usePlatformStore } from '@/features/platform/stores';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import useClient from '@/hooks/use-client';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderNav } from './header-nav';
import HeaderProfile from './header-profile';

type Props = {};

export const Header = (props: Props) => {
  const { isBusiness, isPreviewChatflowPage } = useBusinessNavigationData();
  const platform = usePlatformStore((state) => state.platform);
  const isClient = useClient();
  const hideNavigation = isBusiness;

  if (!isClient) return null;
  console.log('platform', platform);
  if (platform === 'mobile') return null;

  return (
    <div
      className={cn(
        'z-50 flex h-header w-full items-center justify-between gap-5 border-b border-neutral-50 bg-background py-4  pl-[1vw] pr-[5vw] md:pl-[5vw]',
        isPreviewChatflowPage && 'hidden',
      )}
    >
      {!hideNavigation && <HeaderNav />}
      <Link
        href={ROUTE_NAMES.ROOT}
        className={cn(
          'mx-auto block w-[60px]',
          isBusiness
            ? 'flex flex-row items-center gap-2 divide-x-[2px] divide-neutral-900'
            : '',
        )}
      >
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
        {isBusiness && (
          <Typography
            className={
              'flex flex-row items-center pl-2 font-semibold text-primary-500-main'
            }
          >
            <Blocks /> Extension
          </Typography>
        )}
      </Link>
      <HeaderProfile />
    </div>
  );
};
