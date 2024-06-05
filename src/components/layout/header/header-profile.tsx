'use client';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import React, { HtmlHTMLAttributes, useState } from 'react';

import {
  Blocks,
  ChevronDownIcon,
  LogInIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { Avatar } from '@/components/data-display';
import { useAuthStore } from '@/stores/auth.store';
import { useAppStore } from '@/stores/app.store';
import { useTranslation } from 'react-i18next';
const HeaderProfile = ({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  const { t } = useTranslation('common');
  const [isOpenDropdown, setOpenDropdown] = useState(false);
  const { isAuthentication, user } = useAuthStore();
  const setShowConfirmLogout = useAppStore(
    (state) => state.setShowConfirmLogout,
  );
  const signOut = async () => {
    setShowConfirmLogout(true);
  };
  return (
    <div className="relative h-full md:w-[60px]">
      <div
        className={cn(
          'z-10 flex h-full items-center justify-end md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2',
          className,
        )}
        {...props}
      >
        {isAuthentication && user ? (
          <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger>
              <div className="relative flex h-9 items-center gap-2 rounded-xl bg-neutral-50 px-3 py-[6px] active:!bg-neutral-200 active:!text-shading md:py-1 md:hover:bg-neutral-100 dark:bg-transparent dark:active:!bg-neutral-700 dark:md:hover:bg-neutral-800 dark:active:text-white">
                <Avatar
                  src={user.avatar || '/person.svg'}
                  size="xs"
                  alt={user?.name || 'Anonymous'}
                />

                <div className="line-clamp-1 hidden max-w-[200px] items-center truncate md:flex">
                  <div className="truncate text-sm font-medium">
                    {user?.name || 'Anonymous'}
                  </div>
                </div>
                <div className="bottom-0 right-0 flex items-center justify-center rounded-full">
                  <ChevronDownIcon className="opacity-60" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={() => setOpenDropdown(false)}
              className='dark:bg-neutral-900 dark:border-neutral-800'
            >
              <Link href={ROUTE_NAMES.ACCOUNT_SETTINGS}>
                <DropdownMenuItem className="flex items-center">
                  <SettingsIcon className="mr-2 size-4" />
                  <span>{t('HEADER.ACCOUNT_SETTING')}</span>
                </DropdownMenuItem>
              </Link>
              {/* {!NEXT_PUBLIC_URL.includes('https://middo.app') && (
                <Link href={ROUTE_NAMES.SPACES}>
                  <DropdownMenuItem className="flex items-center">
                    <Blocks className="mr-2 size-4" />
                    <span>{t('HEADER.MIDDO_EXTENSION')}</span>
                  </DropdownMenuItem>
                </Link>
              )} */}

              <DropdownMenuItem className="flex items-center" onClick={signOut}>
                <LogOutIcon className="mr-2 size-4" />
                <span> {t('HEADER.SIGN_OUT')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger>
              <div className="relative flex h-9 items-center gap-2 rounded-xl bg-neutral-50 px-3 py-[6px] active:!bg-neutral-200 active:!text-shading md:py-1 md:hover:bg-neutral-100 dark:bg-transparent dark:active:!bg-neutral-700 dark:md:hover:bg-neutral-800">
                <UserRoundIcon size={16}/>
                <div className="bottom-0 right-0 flex items-center justify-center rounded-full">
                  <ChevronDownIcon className="opacity-60" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={() => setOpenDropdown(false)}
              className='dark:bg-neutral-900 dark:border-neutral-800'
            >
              <Link href={ROUTE_NAMES.SIGN_IN}>
                <DropdownMenuItem className="flex items-center">
                  <LogInIcon className="mr-2 size-4" />
                  <span>{t('HEADER.SIGN_IN')}</span>
                </DropdownMenuItem>
              </Link>
              <Link href={ROUTE_NAMES.SETTINGS}>
                <DropdownMenuItem className="flex items-center">
                  <SettingsIcon className="mr-2 size-4" />
                  <span> {t('HEADER.SETTINGS')}</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          // <Link
          //   href={ROUTE_NAMES.SIGN_IN}
          //   className="group flex size-9 items-center rounded-full bg-neutral-50 py-[6px] active:!bg-neutral-200 active:!text-shading md:size-fit md:gap-2 md:rounded-xl md:px-4 md:py-1 md:hover:bg-neutral-100"
          // >
          //   <Image
          //     src="/hero_avatar.png"
          //     priority
          //     className="block md:hidden"
          //     alt="logo"
          //     width={500}
          //     height={500}
          //   />
          //   <span
          //     className={
          //       'hidden  whitespace-nowrap font-medium active:bg-background-darker active:!text-shading md:inline md:!p-0 md:active:!bg-transparent md:group-hover:text-primary-500-main'
          //     }
          //   >
          //     {t('HEADER.SIGN_IN')}
          //   </span>
          // </Link>
        )}
      </div>
    </div>
  );
};

export default HeaderProfile;
