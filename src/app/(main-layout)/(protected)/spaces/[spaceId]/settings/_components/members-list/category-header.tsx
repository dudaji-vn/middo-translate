import React from 'react';
import { Typography } from '@/components/data-display';
import { UserCog } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ESPaceRoles } from '../space-setting/setting-items';
import { useTranslation } from 'react-i18next';

export const CategoryHeader = ({ role }: { role: ESPaceRoles }) => {
  const { t } = useTranslation('common');
  return (
    <>
      <div
        className={cn(
          'flex w-full flex-row items-center gap-3 bg-[#fafafa] py-4 font-semibold sm:p-[20px_40px]',
        )}
      >
        <UserCog size={16} className="stroke-[3px] text-primary-500-main" />
        <Typography className="text-primary-500-main ">
          {role === ESPaceRoles.Admin
            ? t('EXTENSION.ROLE.ADMIN_ROLE')
            : t('EXTENSION.ROLE.MEMBER_ROLE')}
        </Typography>
      </div>
      <div
        className={cn('flex w-full flex-row items-center justify-start py-2 ')}
      >
        <div className="invisible !w-[50px]" />
        <div className="flex  h-auto w-[400px] flex-row items-center justify-start break-words px-3 md:w-[500px] xl:w-[800px]">
          <Typography className="text-sm  font-light text-neutral-800">
            {t('EXTENSION.MEMBER.EMAIL')}
          </Typography>
        </div>
        <Typography
          className={cn(
            'w-[100px] text-sm font-light capitalize text-gray-500',
          )}
        >
          {t('EXTENSION.MEMBER.STATUS')}
        </Typography>
      </div>
    </>
  );
};
