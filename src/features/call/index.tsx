'use client';

import { useVideoCallStore } from './store/video-call.store';
import { CommonComponent } from './components/common/common';
import VideoCall from './video-call';
import ReceiveVideoCall from './receive-call';
import { useNetworkStatus } from '@/utils/use-network-status';

const CallVideoModalContainer = () => {
  const clearStateVideoCall = useVideoCallStore(state => state.clearStateVideoCall);
  const room = useVideoCallStore(state => state.room);
  const setRoom = useVideoCallStore(state => state.setRoom);

  const { isOnline } = useNetworkStatus();
  if(!isOnline) {
    if(room) {
      setRoom()
      clearStateVideoCall();
    }
    return;
  }
  return (
    <>
      <VideoCall />
      <ReceiveVideoCall />
      <CommonComponent />
    </>
  );
};

export default CallVideoModalContainer;
