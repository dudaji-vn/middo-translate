'use client';

import { useEffect } from 'react';
import socket from '@/lib/socket-io';
import { sendEvent } from './utils/custom-event.util';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from './store/video-call.store';
import { CommonComponent } from './components/common/common';
import VideoCall from './video-call';
import ReceiveVideoCall from './receive-call';
import { useNetworkStatus } from '@/utils/use-network-status';
import { CUSTOM_EVENTS } from '@/configs/custom-event';

const CallVideoModalContainer = () => {
  const removeRequestCall = useVideoCallStore(state => state.removeRequestCall);
  const clearStateVideoCall = useVideoCallStore(state => state.clearStateVideoCall);
  const room = useVideoCallStore(state => state.room);
  const setRoom = useVideoCallStore(state => state.setRoom);

  const { isOnline } = useNetworkStatus();
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.MEETING_END, (roomIdEnd: string) => {
      removeRequestCall(roomIdEnd);
      sendEvent(CUSTOM_EVENTS.CALL.MEETING_END, roomIdEnd);
    });
    socket.on(SOCKET_CONFIG.EVENTS.CALL.START, (roomIdStart: string) => {
      sendEvent(CUSTOM_EVENTS.CALL.MEETING_START, roomIdStart);
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.MEETING_END);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.START);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if(!isOnline) {
    if(room) {
      setRoom(null)
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
