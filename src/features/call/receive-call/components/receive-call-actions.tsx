'use client';

import { Button } from '@/components/actions';
import { Phone, PhoneOff } from 'lucide-react';
import { useAppStore } from '@/stores/app.store';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
interface ReceiveVideoCallActionsProps {
  acceptCall: () => void;
  declineCall: () => void;
}
const ReceiveVideoCallActions = ({acceptCall, declineCall}: ReceiveVideoCallActionsProps) => {
  const {t} = useTranslation('common')
  const isMobile = useAppStore((state) => state.isMobile);
  return (
    <div className="flex justify-around md:justify-center gap-16">
      <div className='flex flex-col gap-1 justify-center items-center'>
        <Button.Icon
          onClick={declineCall}
          size={isMobile ? 'lg' : 'md'}
          color="error" 
          shape={'default'}
          variant="default"
        >
          <PhoneOff/>
        </Button.Icon>
        <span className="text-neutral-600 dark:text-neutral-200 text-xs font-light">{t('COMMON.DECLINE')}</span>
      </div>
      <div className='flex flex-col gap-1 justify-center items-center'>
        <Button.Icon
          onClick={acceptCall}
          size={isMobile ? 'lg' : 'md'}
          color="success"
          shape={'default'}
          variant="default"
          className={cn(isMobile && 'w-20 h-20')}
        >
          <Phone/>
        </Button.Icon>
        <span className="text-neutral-600 dark:text-neutral-200 text-xs font-light">{t('COMMON.ACCEPT_CALL')}</span>
      </div>
    </div>
  );
};

export default memo(ReceiveVideoCallActions);
