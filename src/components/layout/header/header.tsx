'use client';

import { Blocks } from 'lucide-react';
import {
  Typography,
} from '@/components/data-display';

import { HeaderNav } from './header-nav';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import HeaderProfile from './header-profile';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

type Props = {};


export const Header = (props: Props) => {
  const { isBusiness, isHelpDesk } = useBusinessNavigationData();
  const hideNavigation = isBusiness || isHelpDesk


  return (
    <div className={cn("z-50 flex h-header w-full items-center justify-between gap-5 border-b border-neutral-50 bg-background py-4  pl-[1vw] pr-[5vw] md:pl-[5vw]",
      isHelpDesk ? 'flex-row justify-start w-full' : '')}>
      <HeaderNav className={hideNavigation ? 'hidden' : ''} />
      <Typography className={isHelpDesk ? ' text-neutral-600 text-xs min-w-14' : 'hidden'}>Power by</Typography>
      <Link href={isHelpDesk ? '#' : ROUTE_NAMES.ROOT} className={cn("block w-[60px] mx-auto",
        isBusiness ? 'flex divide-x-[2px] flex-row items-center gap-2 divide-neutral-900' : '',
        isHelpDesk ? 'flex flex-row mx-0 justify-start items-center' : '')}>
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
        <Typography className={isBusiness ? 'flex flex-row items-center pl-2 text-primary-500-main font-semibold' : 'hidden'}> <Blocks /> Extension</Typography>
      </Link>
      <HeaderProfile className={isHelpDesk ? 'hidden' : ''} />
    </div>
  );
};
