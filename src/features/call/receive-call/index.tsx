'use client';

import { useCallback, useEffect } from 'react';
import { useVideoCallStore } from '../store/video-call.store';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useAuthStore } from '@/stores/auth.store';
import ReceiveVideoCallHeader from './components/receive-call-header';
import ReceiveVideoCallContent from './components/receive-call-content';
import ReceiveVideoCallActions from './components/receive-call-actions';
import CallDragable from '../components/call-dragable';
import usePlayAudio from '../hooks/use-play-audio';

const ReceiveVideoCall = () => {
  
  const requestCall = useVideoCallStore(state => state.requestCall);
  const addRequestCall = useVideoCallStore(state => state.addRequestCall);
  const me = useAuthStore(state => state.user);

  const { playAudio, stopAudio } = usePlayAudio('/mp3/ringing.mp3');

  const listenToCall = useCallback(
    ({ call, user }: any) => {
      if (user._id == me?._id) return;
      const isHave = requestCall.find((item: any) => item.id == call.roomId);
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
    <CallDragable className='md:h-[252px]'>
      <ReceiveVideoCallHeader />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <ReceiveVideoCallContent />
        <ReceiveVideoCallActions />
      </div>
    </CallDragable>
  );
};

export default ReceiveVideoCall;
