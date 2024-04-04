'use client';

import { Blocks, Info, Minus } from 'lucide-react';
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
import useClient from '@/hooks/use-client';
import { Button } from '@/components/actions';
import HelpDeskDropdownMenu from './help-desk-dropdown-menu';
import { COMMIT_SHA, LATEST_TAG } from '@/configs/commit-data';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';

type Props = {};


export const Header = (props: Props) => {
  const { isBusiness, isHelpDesk } = useBusinessNavigationData();
  const [open, setOpen] = useState(false);
  const isClient = useClient();
  const hideNavigation = isBusiness || isHelpDesk
  const {data}= useQuery({
    queryKey: ["backend-version"],
    queryFn: async () => {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/version`);
      return response.json();
    },
  })

  const  {tag:backendTag, commit: backendCommit }= data as {
    tag: string;
    commit: string;
  } || {tag: '', commit: ''};
  
  if (!isClient) return null;

  return (
    <div className={cn("z-50 flex h-header w-full items-center justify-between gap-5 border-b border-neutral-50 bg-background py-4  pl-[1vw] pr-[5vw] md:pl-[5vw]",
      isHelpDesk ? 'flex-row justify-between w-full' : '')}>
      {!hideNavigation && <HeaderNav />}
      <Link href={isHelpDesk ? '#' : ROUTE_NAMES.ROOT} className={cn("block w-[60px] mx-auto",
        isBusiness ? 'flex divide-x-[2px] flex-row items-center gap-2 divide-neutral-900' : '',
        isHelpDesk ? 'flex flex-row mx-0 justify-start items-center' : '')}>
        {isHelpDesk && <Typography className={'text-neutral-600 text-xs min-w-14'}>Power by</Typography>}
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
        <Button.Icon onClick={() => {
          setOpen(!open)
        }} >
          <Info />
        </Button.Icon>
        {isBusiness && <Typography className={'flex flex-row items-center pl-2 text-primary-500-main font-semibold'}> <Blocks /> Extension</Typography>}
      </Link>
      {!isHelpDesk && <HeaderProfile />}
      {isHelpDesk && <HelpDeskDropdownMenu />}
      <ConfirmAlertModal
        title="Release note"
        description={``}
        open={open}
        onOpenChange={() => setOpen(!open)}
        actionProps={{
          className: 'hidden'
        }}
      >
        <Typography variant='h6'>Frontend:</Typography>
        <Typography className="text-neutral-600 text-xs">Commit: {COMMIT_SHA}</Typography>
        <Typography className="text-neutral-600 text-xs">Tag: {LATEST_TAG}</Typography>
        <Typography variant='h6'>Backend:</Typography>
        <Typography className="text-neutral-600 text-xs">Commit: {backendCommit}</Typography>
        <Typography className="text-neutral-600 text-xs">Tag: {backendTag}</Typography>

        
      </ConfirmAlertModal>
    </div>
  );
};
