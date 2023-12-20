'use client';

import {
  ChevronDown,
  LogOutOutline,
  SettingsOutline,
} from '@easy-eva-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { Avatar } from '../data-display/avatar';
import { HeaderNavigation } from './header-navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth';
import { useState } from 'react';

type Props = {};

export const Header = (props: Props) => {
  const [isOpenDropdown, setOpenDropdown] = useState(false);
  const { isAuthentication, user } = useAuthStore();
  const setShowConfirmLogout = useAppStore(
    (state) => state.setShowConfirmLogout,
  );
  const signOut = async () => {
    setShowConfirmLogout(true);
  };

  return (
    <div className="z-50 flex h-header w-full items-center justify-between gap-5 border-b border-colors-neutral-50 bg-background px-[5vw] py-4">
      <HeaderNavigation />
      <Link href={ROUTE_NAMES.ROOT} className="block w-[60px]">
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
      </Link>

      <div className="flex flex-1 items-center justify-end">
        {isAuthentication && user ? (
          <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger>
              <div className="relative flex gap-2 rounded-xl bg-colors-neutral-50 p-2 active:!bg-colors-neutral-200 active:!text-shading md:hover:bg-colors-neutral-100">
                <Avatar
                  src={user.avatar || '/person.svg'}
                  size="xs"
                  alt={user?.name || 'Anonymous'}
                />

                <div className="hidden items-center md:flex">
                  <div className="text-sm font-medium">
                    {user?.name || 'Anonymous'}
                  </div>
                </div>
                <div className="bottom-0 right-0 flex items-center justify-center rounded-full">
                  <ChevronDown className="opacity-60" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
              onClick={() => setOpenDropdown(false)}
            >
              <Link
                href={ROUTE_NAMES.ACCOUNT_SETTINGS}
                className="flex items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary"
              >
                <SettingsOutline />
                Account setting
              </Link>{' '}
              <a
                onClick={signOut}
                className="flex cursor-pointer items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary"
              >
                <LogOutOutline />
                Sign out
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href={ROUTE_NAMES.SIGN_IN}
            className="size-9 md:size-fit group flex items-center rounded-full bg-colors-neutral-50 p-1 active:!bg-colors-neutral-200 active:!text-shading md:gap-2 md:rounded-xl md:p-2 md:px-4 md:hover:bg-colors-neutral-100"
          >
            <Image
              src="/hero_avatar.png"
              priority
              className="block md:hidden"
              alt="logo"
              width={500}
              height={500}
            />

            <span
              className={
                'hidden  font-medium active:bg-background-darker active:!text-shading md:inline md:!p-0 md:active:!bg-transparent md:group-hover:text-colors-primary-500-main'
              }
            >
              Sign in
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};
