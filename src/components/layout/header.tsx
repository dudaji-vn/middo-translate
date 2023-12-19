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
      <Link href={ROUTE_NAMES.ROOT} className="block w-[70px]">
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
      </Link>

      <div className="flex flex-1 items-center justify-end">
        {isAuthentication && user ? (
          <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
            <div className="relative flex gap-2 active:!text-shading ">
              <div className="hidden  items-center md:flex">
                <div className="font-semibold">{user?.name || 'Anonymous'}</div>
              </div>
              <DropdownMenuTrigger>
                <div className="relative">
                  <Avatar
                    src={user.avatar || '/person.svg'}
                    size="sm"
                    alt={user?.name || 'Anonymous'}
                  />

                  <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-1">
                    <ChevronDown className="opacity-60" />
                  </div>
                </div>
              </DropdownMenuTrigger>
            </div>
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
            className="group flex items-center gap-3"
          >
            <span
              className={
                'hidden bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:inline md:!p-0 md:active:!bg-transparent md:group-hover:text-colors-primary-500-main'
              }
            >
              Sign in
            </span>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-colors-neutral-50">
              <div className="w-6">
                <Image
                  src="/avatar.png"
                  priority
                  className="block"
                  alt="logo"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
