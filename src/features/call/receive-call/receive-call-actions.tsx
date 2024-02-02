'use client';

import { Button } from '@/components/actions';
import { Phone, PhoneOff } from 'lucide-react';
import { useVideoCallStore } from '../store/video-call.store';
import { useAppStore } from '@/stores/app.store';
import { memo } from 'react';

const ReceiveVideoCallActions = () => {
  const { requestCall, removeRequestCall, setRoom } = useVideoCallStore();
  const isMobile = useAppStore((state) => state.isMobile);

  const declineCall = () => {
    removeRequestCall();
  };
  const acceptCall = () => {
    removeRequestCall();
    setRoom(requestCall[0]?.call);
  };
  return (
    <div className="flex justify-around gap-2 p-3 pb-20 md:pb-3">
      <Button
        onClick={declineCall}
        size={isMobile ? 'md' : 'xs'}
        color="error"
        shape={isMobile ? 'default' : 'square'}
        variant="default"
        startIcon={<PhoneOff className="m-0 md:mr-1" />}
        className="p-7 md:flex-1 md:px-3 md:py-2"
      >
        <span className="hidden md:inline-block">Decline</span>
      </Button>
      <Button
        onClick={acceptCall}
        size={isMobile ? 'md' : 'xs'}
        color="success"
        shape={isMobile ? 'default' : 'square'}
        variant="default"
        startIcon={<Phone className="m-0 md:mr-1" />}
        className="p-7 md:flex-1 md:px-3 md:py-2"
      >
        <span className="hidden md:inline-block">Accept</span>
      </Button>
    </div>
  );
};

export default memo(ReceiveVideoCallActions);
