'use client';


import { HelpCircleIcon, ShieldIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/data-entry';
import Tooltip  from '@/components/data-display/custom-tooltip/tooltip';

export default function RestrictMessage() {
 
  const { t } = useTranslation('common');
  

  return (
    <>
      <div className="flex w-full items-center border-b border-b-[#F2F2F2] bg-white px-5 py-4 md:hover:bg-primary-100">
        <div className="relative flex !h-10 !w-10 min-w-10 items-center justify-center rounded-xl bg-primary-200 text-primary">
          <ShieldIcon size={20} />
        </div>
        <span className="ml-4 block text-left text-base font-medium ">
          {t('ACCOUNT_SETTING.RESTRICT_MESSAGE')}
        </span>
        <span className='flex-1'>
          <Tooltip
            title={t('TOOL_TIP.RESTRICT_MESSAGE')}
            triggerItem={
              <HelpCircleIcon className='size-4 mx-1 md:mx-3 color-primary text-primary'/>
            }
            contentProps={{
              className: 'max-w-[200px]',
            }}
          />

        </span>
        <Switch className='cursor-pointer'></Switch>
      </div>
    </>
  );
}
