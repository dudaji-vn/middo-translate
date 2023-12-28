'use client';

import { ArrowLeft, LogOutIcon } from 'lucide-react';

import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import Image from 'next/image';
import { LANGUAGE_CODES_MAP } from '@/configs/default-language';
import UpdateUserAvatar from '@/features/user-settings/UpdateUserAvatar';
import UpdateUserInfo from '@/features/user-settings/UpdateUserInfo';
import UpdateUserPassword from '@/features/user-settings/UpdateUserPassword';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';

export default function AccountSettings() {
  const { user } = useAuthStore();
  const setShowConfirmLogout = useAppStore(
    (state) => state.setShowConfirmLogout,
  );

  const signOut = () => {
    setShowConfirmLogout(true);
  };
  const router = useRouter();

  return (
    <div>
      <div className="mx-auto flex w-full items-center gap-2 px-[5vw] py-5">
        <Button.Icon
          color="default"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button.Icon>
        <span className="font-semibold">Account setting</span>
      </div>

      <div className="mx-auto w-full rounded-3xl px-5 py-5 pb-0 md:max-w-[500px] md:overflow-hidden md:shadow-2">
        <div className="relative mx-auto h-20 w-20 ">
          <Image
            src={user?.avatar || '/person.svg'}
            priority
            alt={user?.name || 'Anonymous'}
            width={500}
            height={500}
            className="h-full w-full overflow-hidden rounded-full object-cover"
          ></Image>
          {user?.language && (
            <div className="absolute bottom-0 left-1/2 mt-2 flex -translate-x-1/2 translate-y-1/2 items-center justify-center">
              <CircleFlag
                countryCode={
                  LANGUAGE_CODES_MAP[
                    user?.language as keyof typeof LANGUAGE_CODES_MAP
                  ].toLowerCase() || ''
                }
                className="inline-block h-5 w-5"
              />
            </div>
          )}
        </div>
        <h2 className="mt-5 text-center text-base">
          {user?.name || 'Anonymous'}
        </h2>
        <p className="text-center text-base text-[#333]">{user?.email || ''}</p>

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
            <LogOutIcon width={16} height={16} fill="#ef4444"></LogOutIcon>
          </span>
          <span className="ml-2 font-medium text-red-500">Sign out</span>
        </p>
      </div>
    </div>
  );
}
