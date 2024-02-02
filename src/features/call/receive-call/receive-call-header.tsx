'use client';

import { Button } from '@/components/actions';
import { Phone, X } from 'lucide-react';
import { memo } from 'react';
import { useVideoCallStore } from '../store/video-call.store';

const ReceiveVideoCallHeader = () => {
  const { requestCall, removeRequestCall } = useVideoCallStore();

  const declineCall = () => {
    removeRequestCall();
  };

  return (
    <div className="flex items-center gap-1 bg-primary-100 py-2 pl-3 pr-1 text-primary md:cursor-grab md:active:cursor-grabbing">
      <Phone className="h-4 w-4 stroke-current" />
      <span className="flex-1 truncate font-semibold">
        {requestCall[0]?.call?.name}
      </span>
      <Button.Icon
        variant="default"
        color="default"
        size="xs"
        onClick={declineCall}
      >
        <X />
      </Button.Icon>
    </div>
  );
};

export default memo(ReceiveVideoCallHeader);
