'use client';

import { ArrowBackOutline, LogOutOutline } from '@easy-eva-icons/react';
import {
  LANGUAGE_CODES_MAP,
  SUPPORTED_LANGUAGES,
} from '@/configs/default-language';

import { CircleFlag } from 'react-circle-flags';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import UpdateUserAvatar from '@/features/user-settings/UpdateUserAvatar';
import UpdateUserInfo from '@/features/user-settings/UpdateUserInfo';
import UpdateUserPassword from '@/features/user-settings/UpdateUserPassword';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth';

export default function AccountSettings() {
  const { user } = useAuthStore();
  const { setData: setDataApp } = useAppStore();

  const signOut = () => {
    setDataApp({ isShowConfirmLogout: true });
  };

  return (
    <div>
      <div className="mx-auto w-full px-[5vw] py-5">
        <Link href={ROUTE_NAMES.ROOT} className="group flex w-fit items-center">
          <span className="mr-4 transition-all group-hover:-translate-x-1">
            {' '}
            <ArrowBackOutline />
          </span>
          <span className="font-semibold">Account setting</span>
        </Link>
      </div>

      <div className="mx-auto w-full rounded-3xl px-5 py-5 pb-0 md:max-w-[500px] md:overflow-hidden md:shadow-2">
        <div className="mx-auto h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={user?.avatar || '/person.svg'}
            priority
            alt={user?.name || 'Anonymous'}
            width={500}
            height={500}
            className="h-full w-full object-cover"
          ></Image>
        </div>
        <h2 className="mt-3 text-center text-base">
          {user?.name || 'Anonymous'}
        </h2>
        <p className="mt-2 text-center text-base text-[#333]">
          {user?.email || ''}
        </p>
        {user?.language && (
          <div className="mt-2 flex items-center justify-center">
            <CircleFlag
              countryCode={
                LANGUAGE_CODES_MAP[
                  user?.language as keyof typeof LANGUAGE_CODES_MAP
                ].toLowerCase() || ''
              }
              className="mr-2 inline-block h-5 w-5"
            />
            <span className="text-sm">
              {SUPPORTED_LANGUAGES.find((lang) => lang.code === user?.language)
                ?.name || ''}
            </span>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-6">
          <UpdateUserInfo />
          <UpdateUserAvatar />
        </div>
        <div className="-mx-[5vw] mt-4 h-2 bg-[#FAFAFA] md:-mx-6"></div>
        <UpdateUserPassword />
        <p
          onClick={signOut}
          className="mx-[-20px] flex cursor-pointer items-center justify-center p-4 text-center font-medium transition-all hover:bg-red-50"
        >
          <span>
            <LogOutOutline
              width={16}
              height={16}
              fill="#ef4444"
            ></LogOutOutline>
          </span>
          <span className="ml-2 font-medium text-red-500">Sign out</span>
        </p>
      </div>
    </div>
  );
}
