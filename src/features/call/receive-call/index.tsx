'use client';

import { useDragControls } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useVideoCallStore } from '../store/video-call.store';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useAuthStore } from '@/stores/auth.store';
import ReceiveVideoCallHeader from './receive-call-header';
import ReceiveVideoCallContent from './receive-call-content';
import ReceiveVideoCallActions from './receive-call-actions';
import CallDragable from '../components/call-dragable';
import usePlayAudio from '../hooks/use-play-audio';

const ReceiveVideoCall = () => {
  const { requestCall, addRequestCall } = useVideoCallStore();
  const { user: me } = useAuthStore();
  const { playAudio, stopAudio } = usePlayAudio('/mp3/ringing.mp3');

  const listenToCall = useCallback(
    ({ call, user }: any) => {
      if (user._id == me?._id) return;
      const isHave = requestCall.find((item) => item.id == call.roomId);
      if (isHave) return;
      addRequestCall({ id: call.roomId, call, user });
    },
    [addRequestCall, me?._id, requestCall],
  );

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, listenToCall);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL);
    };
  }, [listenToCall]);

  useEffect(() => {
    if (requestCall.length > 0) {
      playAudio();
    } else {
      stopAudio();
    }
  }, [playAudio, requestCall.length, stopAudio]);

  if (requestCall.length === 0) return null;

  return (
    <CallDragable>
      <ReceiveVideoCallHeader />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <ReceiveVideoCallContent />
        <ReceiveVideoCallActions />
      </div>
    </CallDragable>
  );
};

export default ReceiveVideoCall;
