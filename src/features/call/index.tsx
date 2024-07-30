'use client';

import { useVideoCallStore } from './store/video-call.store';
import { CommonComponent } from './components/common/common';
import VideoCall from './video-call';
import ReceiveVideoCall from './receive-call';
import { useNetworkStatus } from '@/utils/use-network-status';
import useSocketVideoCall from './hooks/socket/use-socket-video-call';

const CallVideoModalContainer = () => {
  const clearStateVideoCall = useVideoCallStore(
    (state) => state.clearStateVideoCall,
  );
  const call = useVideoCallStore((state) => state.call);
  const setCall = useVideoCallStore((state) => state.setCall);
  useSocketVideoCall();
  const { isOnline } = useNetworkStatus();
  if(call && !isOnline) {
    setCall();
    clearStateVideoCall()
  }

  if(!isOnline) return null;

  return (
    <>
      <VideoCall />
      <ReceiveVideoCall />
      <CommonComponent />
    </>
  );
};

export default CallVideoModalContainer;
