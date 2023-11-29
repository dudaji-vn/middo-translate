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

import { HeaderNavigation } from './header-navigation';

type Props = {};

export const Header = (props: Props) => {
  return (
    <div className="z-2 mb-10 flex w-full items-center justify-between gap-5 bg-background px-[5vw] py-4 shadow-1">
      <HeaderNavigation />

      <a href="#" className="shrink-0">
        <img src="/logo.png" alt="" className="w-[100px]" />
      </a>

      <div className="flex flex-1 items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="relative flex gap-3 active:!text-shading ">
              <div className="hidden flex-col items-end md:flex">
                <div className="font-semibold">User name</div>
                <div className="text-s font-light">email@gmail.com</div>
              </div>
              <a href="#" className="relative">
                <img src="/hero_avatar.png" alt="" className="h-12 w-12" />
                <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-1">
                  <ChevronDown className="opacity-60" />
                </div>
              </a>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
          >
            <a
              href="#"
              className="flex items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary"
            >
              <SettingsOutline />
              Account setting
            </a>{' '}
            <a
              href="#"
              className="flex items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary"
            >
              <LogOutOutline />
              Sign out
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
