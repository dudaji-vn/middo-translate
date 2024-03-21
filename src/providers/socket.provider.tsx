'use client';

import React, { useEffect } from 'react';

import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useChatStore } from '@/features/chat/store';

const SocketProvider = () => {
  const user = useAuthStore((state) => state.user);
  const setOnlineList = useChatStore((state) => state.setOnlineList);
  useEffect(() => {
    function onConnect() {
      if (user?._id) {
        console.log('connected', user._id);
        socket.emit(SOCKET_CONFIG.EVENTS.CLIENT.JOIN, user._id);
        socket.on(SOCKET_CONFIG.EVENTS.CLIENT.LIST, (data) => {
          setOnlineList(data);
        });
      }
    }

    function onDisconnect() {
      console.log('disconnected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
      socket.off(SOCKET_CONFIG.EVENTS.CLIENT.LIST);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  return <></>;
};

export default SocketProvider;
