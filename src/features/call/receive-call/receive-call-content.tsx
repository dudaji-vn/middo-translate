'use client';

import { useVideoCallStore } from '../store/video-call.store';
import { Avatar } from '@/components/data-display';
import { useAppStore } from '@/stores/app.store';
import { memo } from 'react';

const ReceiveVideoCallContent = () => {
  const { requestCall } = useVideoCallStore();
  const isMobile = useAppStore((state) => state.isMobile);

  return (
    <div className="relative flex h-full flex-1 flex-col justify-center overflow-hidden p-3">
      <div className="flex items-center justify-center gap-2">
        <Avatar
          size={isMobile ? '4xl' : 'lg'}
          src={
            requestCall[0]?.call?.avatar ||
            requestCall[0]?.user?.avatar ||
            '/person.svg'
          }
          alt="avatar"
        />
        {requestCall[0]?.room?.participants?.length > 2 && (
          <p className="truncate">{requestCall[0]?.call?.name}</p>
        )}
      </div>
      <p className="mt-3 text-center">
        <strong>{requestCall[0]?.user?.name}</strong> is calling
      </p>
    </div>
  );
};

export default memo(ReceiveVideoCallContent);
