'use client';

import React, { useEffect, useState } from 'react';

import socket from '@/lib/socket-io';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useChatStore } from '@/features/chat/stores';
import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useParams } from 'next/navigation';

const SocketProvider = () => {
  const { isElectron, ipcRenderer } = useElectron();
  const user = useAuthStore((state) => state.user);
  const { anonymousId, isHelpDesk, extensionId } = useBusinessNavigationData();
  const setOnlineList = useChatStore((state) => state.setOnlineList);
  const setSocketConnected = useAppStore((state) => state.setSocketConnected);


  useEffect(() => {
    function onConnect() {
      const clientId = anonymousId || user?._id;
      const clientTempId = localStorage.getItem('clientTempId');
      setSocketConnected(true);
      if (clientId) {
        socket.emit(SOCKET_CONFIG.EVENTS.CLIENT.JOIN, clientId || clientTempId);
        socket.on(SOCKET_CONFIG.EVENTS.CLIENT.LIST, (data) => {
          setOnlineList(data);
        });
      }
    }

    function onDisconnect() {
      console.log('socket.onDisconnected');
      setSocketConnected(false);
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
  }, [anonymousId, user?._id]);

  useEffect(() => {
    // console.log('socket.provider.tsx: WINDOW_FOCUSED');
    if (isElectron && ipcRenderer) {
      ipcRenderer.on(ELECTRON_EVENTS.WINDOW_FOCUSED, (e: any) => {
        console.log('Ensure socket connection');
        if (!socket.connected) {
          console.log('socket re-connection');
          socket.connect();
        } else {
          console.log('socket connected (skip)');
        }
      });
    }
    return () => {};
  }, [ipcRenderer, isElectron]);

  return <></>;
};

export default SocketProvider;
