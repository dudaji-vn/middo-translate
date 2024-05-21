'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useVideoCallStore } from '../store/video-call.store';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useAuthStore } from '@/stores/auth.store';
import ReceiveVideoCallHeader from './components/receive-call-header';
import ReceiveVideoCallContent from './components/receive-call-content';
import ReceiveVideoCallActions from './components/receive-call-actions';
import usePlayAudio from '../hooks/use-play-audio';
import { motion, useDragControls } from 'framer-motion';

const ReceiveVideoCall = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();

  const requestCall = useVideoCallStore((state) => state.requestCall);
  const addRequestCall = useVideoCallStore((state) => state.addRequestCall);
  const me = useAuthStore((state) => state.user);
  const removeRequestCall = useVideoCallStore(
    (state) => state.removeRequestCall,
  );
  const setRoom = useVideoCallStore((state) => state.setRoom);

  const { playAudio, stopAudio } = usePlayAudio('/mp3/ringing.mp3');

  const listenToCall = useCallback(
    ({ call, user }: any) => {
      if (user._id == me?._id) return;
      const isHave = requestCall.find((item: any) => item.id == call.roomId);
      if (isHave) return;
      if (requestCall.length == 0) {
        addRequestCall({ id: call.roomId, call, user });
      }
    },
    [addRequestCall, me?._id, requestCall],
  );

  const declineCall = useCallback(() => {
    socket.emit(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, {
      roomId: requestCall[0]?.call.roomId,
      userId: me?._id,
    });
    removeRequestCall();
  }, [me?._id, removeRequestCall, requestCall]);

  const acceptCall = useCallback(() => {
    removeRequestCall();
    setRoom(requestCall[0]?.call);
    setTimeout(() => {
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, {
        roomId: requestCall[0]?.call.roomId,
        userId: me?._id,
      });
    }, 3000);
  }, [me?._id, removeRequestCall, requestCall, setRoom]);

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

  // Auto decline call after 30s
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (requestCall.length > 0) {
      timeout = setTimeout(() => {
        stopAudio();
        declineCall();
      }, 30000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [declineCall, me?._id, requestCall, stopAudio]);

  if (requestCall.length === 0) return null;

  return (
    <motion.div
      ref={constraintsRef}
      className="max-h-vh pointer-events-none fixed inset-0 z-50 block h-full cursor-auto bg-transparent"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragControls={controls}
        dragMomentum={false}
        className="pointer-events-auto absolute h-full w-full cursor-auto rounded-xl shadow-glow md:bottom-4 md:left-4 md:h-[252px] md:w-[336px]"
      >
        <div className="max-h-vh flex h-full bg-white w-full flex-col overflow-hidden rounded-none md:rounded-xl">
          <ReceiveVideoCallHeader />
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <ReceiveVideoCallContent />
            <ReceiveVideoCallActions
              acceptCall={acceptCall}
              declineCall={declineCall}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReceiveVideoCall;
