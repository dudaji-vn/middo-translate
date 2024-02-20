'use client';

import { useEffect } from 'react';
import socket from '@/lib/socket-io';
import { sendEvent } from './utils/custom-event.util';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from './store/video-call.store';
import { CommonComponent } from './components/common/common';
import VideoCall from './video-call';
import ReceiveVideoCall from './receive-call';

const CallVideoModalContainer = () => {
  const { removeRequestCall } = useVideoCallStore();
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.MEETING_END, (roomIdEnd: string) => {
      removeRequestCall(roomIdEnd);
      sendEvent('MEETING_END', roomIdEnd);
    });
    socket.on(SOCKET_CONFIG.EVENTS.CALL.START, (roomIdStart: string) => {
      sendEvent('MEETING_START', roomIdStart);
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.MEETING_END);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.START);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <VideoCall />
      <ReceiveVideoCall />
      <CommonComponent />
    </>
  );
};

export default CallVideoModalContainer;
