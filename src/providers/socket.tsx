'use client';

import React, { useEffect } from 'react';

import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth';

const SocketProvider = () => {
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (!user?._id) {
      return;
    }
    socket.connect();
    function onConnect() {
      if (user?._id) {
        socket.emit('client.join', user._id);
      }
    }

    function onDisconnect() {
      console.log('disconnected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [user?._id]);

  return <></>;
};

export default SocketProvider;
