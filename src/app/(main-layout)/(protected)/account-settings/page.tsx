'use client';

import { LogOut } from 'lucide-react';

import { Button, CopyZoneClick } from '@/components/actions';
import { LANGUAGE_CODES_MAP } from '@/configs/default-language';
import UpdateUserAvatar from '@/features/user-settings/update-user-avatar';
import UpdateUserInfo from '@/features/user-settings/update-user-info';
import UpdateUserPassword from '@/features/user-settings/update-user-password';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import Image from 'next/image';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';
import SelectPageLanguage from './_components/select-page-language';
import { DeleteAccount } from '@/features/user-settings/delete-account';

export default function AccountSettings() {
  const { user } = useAuthStore();
  const setShowConfirmLogout = useAppStore(
    (state) => state.setShowConfirmLogout,
  );
  const { t } = useTranslation('common');
  const signOut = () => {
    setShowConfirmLogout(true);
  };

  return (
    <div className="container-height overflow-auto">
      <div className="mx-auto w-full bg-[#FCFCFC] md:my-8 md:max-w-[500px] md:overflow-hidden md:rounded-xl md:shadow-2">
        <div className="flex flex-col items-center p-10">
          <div className="relative mx-auto h-24 w-24 ">
            <Image
              src={user?.avatar || '/person.svg'}
              priority
              alt={user?.name || 'Anonymous'}
              width={500}
              height={500}
              className="h-full w-full overflow-hidden rounded-full border border-neutral-50 object-cover"
            ></Image>
            {user?.language && (
              <div className="absolute -bottom-1 -right-1 mt-2 flex items-center justify-center overflow-hidden rounded-full border-4 border-[#FCFCFC]">
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
          <h2 className="mt-5 w-full break-words px-4  text-center text-lg text-neutral-800">
            {user?.name || 'Anonymous'}
          </h2>
          <p className="mb-3 text-center text-sm font-light text-neutral-800">
            {user?.email || ''}
          </p>
          <CopyZoneClick text={user?.username || ''}>
            <Button color="secondary" size="xs" shape="square">
              {user?.username}
            </Button>
          </CopyZoneClick>
        </div>
        <div className="">
          <UpdateUserInfo />
          <UpdateUserAvatar />
          <UpdateUserPassword />
        </div>
        <div className="my-4">
          <SelectPageLanguage />
        </div>
        <div
          className="flex w-full cursor-pointer items-center bg-white px-5 py-4 md:hover:bg-neutral-100/20"
          onClick={signOut}
        >
          <Button.Icon
            color={'default'}
            size={'sm'}
            className="relative !h-10 !w-10 rounded-xl"
          >
            <LogOut size={20} />
          </Button.Icon>
          <span className="ml-4 block text-center text-base font-medium ">
            {t('ACCOUNT_SETTING.SIGN_OUT')}
          </span>
        </div>
        <DeleteAccount />
      </div>
    </div>
  );
}
