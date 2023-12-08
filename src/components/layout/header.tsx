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
import { Button } from '../actions';
import { HeaderNavigation } from './header-navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {};

export const Header = (props: Props) => {
  const [isOpenDropdown, setOpenDropdown] = useState(false);
  const { isAuthentication, user } = useAuthStore();
  const { setData: setDataApp } = useAppStore();
  const router = useRouter();

  const signOut = async () => {
    setDataApp({ isShowConfirmLogout: true });
  };

  return (
    <div className="z-50 flex h-[90px] w-full items-center justify-between gap-5 bg-background px-[5vw] py-4 shadow-1">
      <HeaderNavigation />

      <Link href={ROUTE_NAMES.ROOT} className="block w-[100px]">
        <Image src="/logo.png" priority alt="logo" width={500} height={500} />
      </Link>

      <div className="flex flex-1 items-center justify-end">
        {isAuthentication ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative flex gap-3 active:!text-shading ">
                <div className="hidden flex-col items-end md:flex">
                  <div className="font-semibold">
                    {user?.name || 'Anonymous'}
                  </div>
                  <div className="text-s font-light">{user?.email || ''}</div>
                </div>
                <a href="#" className="relative">
                  <Avatar
                    src={user.avatar || '/person.svg'}
                    size="lg"
                    alt={user?.username || 'Anonymous'}
                  />

                  <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-1">
                    <ChevronDown className="opacity-60" />
                  </div>
                </a>
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
          <div className="flex items-center gap-3">
            <Link
              href={ROUTE_NAMES.SIGN_UP}
              className={
                'hidden bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:inline md:!p-0 md:hover:text-secondary md:active:!bg-transparent'
              }
            >
              Sign up
            </Link>
            <Button
              onClick={() => router.push(ROUTE_NAMES.SIGN_IN)}
              className="inline-block p-4 px-8"
            >
              Sign in
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
