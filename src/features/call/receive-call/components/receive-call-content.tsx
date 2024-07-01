'use client';

import { useVideoCallStore } from '../../store/video-call.store';
import { Avatar } from '@/components/data-display';
import { useAppStore } from '@/stores/app.store';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ReceiveVideoCallContent = () => {
  const requestCall = useVideoCallStore(state => state.requestCall);
  const isMobile = useAppStore((state) => state.isMobile);
  const {t} = useTranslation('common')
  return (
    <div className="relative flex h-full flex-1 flex-col justify-center overflow-hidden p-3">
      <div className="flex items-center justify-center gap-2">
        <Avatar
          size={isMobile ? '4xl' : 'lg'}
          src={
            requestCall?.call?.avatar ||
            requestCall?.user?.avatar ||
            '/person.svg'
          }
          alt="avatar"
        />
        {requestCall?.room?.participants && requestCall?.room?.participants?.length > 2 && (
          <p className="truncate">{requestCall?.call?.name}</p>
        )}
      </div>
      <p className="mt-3 text-center" dangerouslySetInnerHTML={{__html: t('CONVERSATION.CALLING', {name: requestCall?.user?.name})}}>
      </p>
    </div>
  );
};

export default memo(ReceiveVideoCallContent);
