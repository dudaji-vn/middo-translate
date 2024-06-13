'use client';

import { CopyIcon, LogOut } from 'lucide-react';

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
import { DeleteAccount } from '@/features/user-settings/delete-account';
import { AppPermission } from '@/features/user-settings/app-permission';
import RestrictMessage from '@/features/user-settings/restrict-message';
import { TurnOffNotification } from '@/features/user-settings/turn-off-notification';
import SelectPageLanguage from '@/features/user-settings/select-page-language';
import SelectTheme from '@/features/user-settings/select-theme';

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
    <div className="container-height overflow-auto dark:bg-background">
      <div className="mx-auto w-full bg-[#FCFCFC] dark:bg-background md:my-8 md:max-w-[500px] md:overflow-hidden md:rounded-xl md:shadow-2 dark:border-neutral-800 dark:md:shadow-3">
        <div className="flex flex-col items-center p-10">
          <div className="relative mx-auto h-24 w-24 ">
            <Image
              src={user?.avatar || '/person.svg'}
              priority
              alt={user?.name || 'Anonymous'}
              width={500}
              height={500}
              className="h-full w-full overflow-hidden rounded-full border border-neutral-50 object-cover dark:border-neutral-800"
            ></Image>
            {user?.language && (
              <div className="absolute -bottom-1 -right-1 mt-2 flex items-center justify-center overflow-hidden rounded-full border-4 border-[#FCFCFC] dark:border-background">
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
          <h2 className="mt-5 w-full break-words px-4  text-center text-lg text-neutral-800 dark:text-neutral-50">
            {user?.name || 'Anonymous'}
          </h2>
          <p className="mb-3 text-center text-sm font-light text-neutral-800 dark:text-neutral-50">
            {user?.email || ''}
          </p>
          <CopyZoneClick text={user?.username || ''}>
            <Button
              color="secondary"
              size="xs"
              shape="square"
              endIcon={<CopyIcon />}
            >
              @{user?.username}
            </Button>
          </CopyZoneClick>
        </div>
        <div className="">
          <UpdateUserInfo />
          <UpdateUserAvatar />
          <UpdateUserPassword />
          <RestrictMessage />
          <TurnOffNotification />
        </div>
        <div className="my-4">
          <SelectPageLanguage />
          <SelectTheme />
          <AppPermission />
        </div>
        <div
          className="flex w-full cursor-pointer items-center bg-white px-5 py-4 md:hover:bg-neutral-100/20 dark:bg-neutral-900"
          onClick={signOut}
        >
          <div className="relative flex !h-10 !w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-50">
            <LogOut size={20} />
          </div>
          <span className="ml-4 block text-center text-base font-medium ">
            {t('ACCOUNT_SETTING.SIGN_OUT')}
          </span>
        </div>
        <DeleteAccount />
      </div>
    </div>
  );
}
