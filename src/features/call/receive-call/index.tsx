'use client';

import { useCallback, useEffect, useRef } from 'react';
import { IRequestCall, useVideoCallStore } from '../store/video-call.store';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useAuthStore } from '@/stores/auth.store';
import ReceiveVideoCallHeader from './components/receive-call-header';
import ReceiveVideoCallContent from './components/receive-call-content';
import ReceiveVideoCallActions from './components/receive-call-actions';
import usePlayAudio from '../hooks/use-play-audio';
import { motion, useDragControls } from 'framer-motion';
import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

const ReceiveVideoCall = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();

  const requestCall = useVideoCallStore((state) => state.requestCall);
  const setRequestCall = useVideoCallStore((state) => state.setRequestCall);
  const me = useAuthStore((state) => state.user);
  
  const setRoom = useVideoCallStore((state) => state.setRoom);
  const room = useVideoCallStore((state) => state.room);
  const { playAudio, stopAudio } = usePlayAudio('/mp3/ringing.mp3');
  const { isElectron, ipcRenderer } = useElectron();
  const listenToCall = useCallback(({ call, user, type, message, room }: IRequestCall) => {
      if (user._id == me?._id) return;
      if (requestCall) return;
      if(room && room.roomId === call.roomId) return;
      const data = { 
        id: call?.roomId, 
        call, 
        user,
        type,
        message,
        room
      }
      // Set avatar for room 
      if(!data.room?.avatar) {
        data.room.avatar = NEXT_PUBLIC_URL + '/icon.png';
      }
      if(!data.room?.station) {
        //@ts-ignore
        data.room.station = {
          name: 'Middo',
          avatar: NEXT_PUBLIC_URL + '/icon.png'
        }
      }
      setRequestCall(data);
      if(isElectron && ipcRenderer) {
        ipcRenderer.send(ELECTRON_EVENTS.RECEIVE_CALL_INVITE, data);
      }
    },
    [ipcRenderer, isElectron, me?._id, requestCall, room, setRequestCall],
  );
  const declineCall = useCallback(() => {
    socket.emit(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, {
      roomId: requestCall?.call?.roomId,
      userId: me?._id,
    });
    setRequestCall();
  }, [me?._id, requestCall?.call.roomId, setRequestCall]);

  const acceptCall = useCallback(() => {
    setRequestCall();
    setRoom(requestCall?.call);
    setTimeout(() => {
      // Auto decline call to avoid hangup on another devices
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, {
        roomId: requestCall?.call.roomId,
        userId: me?._id,
      });
    }, 3000);
  }, [me?._id, requestCall?.call, setRequestCall, setRoom]);

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, listenToCall);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL);
    };
  }, [listenToCall]);

  useEffect(() => {
    if (requestCall?.id) {
      playAudio();
    } else {
      stopAudio();
    }
  }, [playAudio, requestCall?.id, stopAudio]);

  // Auto decline call after 30s
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (requestCall) {
      timeout = setTimeout(() => {
        stopAudio();
        declineCall();
      }, 30000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [declineCall, me?._id, requestCall, stopAudio]);

  const handleReceiveCall = useCallback((response : ('DECLINE' | 'ACCEPT')) => {
    switch (response) {
      case 'DECLINE':
        declineCall();
        break;
      case 'ACCEPT':
        acceptCall();
        break;
      default:
        break;
    }
  }, [acceptCall, declineCall]);

  // Event electron receive call
  useEffect(() => {
    if(isElectron && ipcRenderer) {
      ipcRenderer.on(ELECTRON_EVENTS.CALL_RESPONSE, handleReceiveCall);
    }
    return () => {
      if(isElectron && ipcRenderer) {
        ipcRenderer.off(ELECTRON_EVENTS.CALL_RESPONSE, handleReceiveCall);
      }
    };
  }, [handleReceiveCall, ipcRenderer, isElectron]);


  // Add on event no call
  useEffect(() => {
    if(!requestCall) {
      if(isElectron && ipcRenderer) {
        ipcRenderer.send(ELECTRON_EVENTS.NO_CALL);
      }
    }
  }, [ipcRenderer, isElectron, requestCall]);


  if (!requestCall) return null;

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
        className="pointer-events-auto absolute h-full w-full cursor-auto rounded-xl shadow-glow md:bottom-4 md:left-4 md:h-[300px] md:w-[320px]"
      >
        <div className="max-h-vh flex h-full bg-white dark:bg-background w-full flex-col overflow-hidden rounded-none md:rounded-xl border border-primary-400">
          <ReceiveVideoCallHeader />
          <div className="relative flex flex-1 flex-col p-5 gap-5 overflow-hidden">
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
