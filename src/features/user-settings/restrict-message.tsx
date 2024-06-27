'use client';

import { HelpCircleIcon, ShieldIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/data-entry';
import { useMutation } from '@tanstack/react-query';
import { toggleAllowUnknown } from '@/services/user.service';
import { getProfileService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export default function RestrictMessage() {
  const { t } = useTranslation('common');
  const { setData, user } = useAuthStore();
  const { mutate } = useMutation({
    mutationFn: toggleAllowUnknown,
    onSuccess: async () => {
      const res = await getProfileService();
      const user = res.data;
      setData({
        user,
      });
    },
  });

  return (
    <>
      <div className="flex w-full items-center border-b bg-white dark:bg-neutral-900 dark:border-b-neutral-800 px-5 py-4">
        <div className="relative flex !h-10 !w-10 min-w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-primary">
          <ShieldIcon size={20} />
        </div>
        <span className="ml-4 block text-left text-base font-medium ">
          {t('ACCOUNT_SETTING.RESTRICT_MESSAGE')}
        </span>
        <span className="flex-1">
          {/* <Tooltip
            title={t('TOOL_TIP.RESTRICT_MESSAGE')}
            triggerItem={
              <HelpCircleIcon className='size-4 mx-1 md:mx-3 color-primary text-primary'/>
            }
            contentProps={{
              className: 'max-w-[200px]',
            }}
            isShowMobile={true}
          /> */}
          <span className="group relative block w-5">
            <div className="pointer-events-none absolute bottom-[110%] right-1/2 w-[200px] max-w-[200px] translate-x-1/4 rounded-lg bg-black/60 px-3 py-[6px] text-xs text-white opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 md:translate-x-1/2">
              <p>{t('TOOL_TIP.RESTRICT_MESSAGE')}</p>
            </div>
            <div className="max-w-[200px]bg-transparent absolute bottom-full right-1/2 h-[10%] w-[200px] translate-x-1/4 md:translate-x-1/2"></div>
            <HelpCircleIcon className="color-primary mx-1 size-4 cursor-pointer text-primary md:mx-3" />
          </span>
        </span>
        <Switch
          checked={!user?.allowUnknown}
          onCheckedChange={() => mutate()}
          className="cursor-pointer"
        />
      </div>
    </>
  );
}
