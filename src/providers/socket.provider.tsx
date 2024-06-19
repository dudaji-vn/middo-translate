'use client';

import React, { useEffect } from 'react';

import socket from '@/lib/socket-io';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { SOCKET_CONFIG } from '@/configs/socket';
import { Meeting, useChatStore } from '@/features/chat/stores';
import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useQueryClient } from '@tanstack/react-query';
import { USE_RELATION_KEY } from '@/features/users/hooks/use-relationship';

const SocketProvider = () => {
  const { isElectron, ipcRenderer } = useElectron();
  const user = useAuthStore((state) => state.user);
  const { anonymousId } = useBusinessNavigationData();
  const setOnlineList = useChatStore((state) => state.setOnlineList);
  const updateMeetingList = useChatStore((state) => state.updateMeetingList);
  const deleteMeeting = useChatStore((state) => state.deleteMeeting);
  const meetingList = useChatStore(state => state.meetingList)
  const setSocketConnected = useAppStore((state) => state.setSocketConnected);
  const queryClient = useQueryClient();
  useEffect(() => {
    function onConnect() {
      const clientId = anonymousId || user?._id;
      console.log('socket.onConnect');
      setSocketConnected(true);
      if (clientId) {
        console.log('connected', clientId);
        socket.emit(SOCKET_CONFIG.EVENTS.CLIENT.JOIN, clientId);
        socket.on(SOCKET_CONFIG.EVENTS.CLIENT.LIST, (data) => {
          setOnlineList(data);
        });
        socket.on(SOCKET_CONFIG.EVENTS.MEETING.LIST, (meetings: Meeting) => {
          updateMeetingList(meetings);
        })
        socket.on(SOCKET_CONFIG.EVENTS.MEETING.UPDATE, (meetings: Meeting) => {
          updateMeetingList(meetings);
        })
        socket.on(SOCKET_CONFIG.EVENTS.MEETING.END, (roomId: string) => {
          deleteMeeting(roomId)
        })
      }
    }

    function onDisconnect() {
      console.log('socket.onDisconnected');
      setSocketConnected(false);
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.connect();
    socket.on(
      SOCKET_CONFIG.EVENTS.USER.RELATIONSHIP.UPDATE,
      ({ userIds }: { userIds: string[] }) => {
        const otherUserId = userIds.find((id) => id !== user?._id);
        if (otherUserId) {
          queryClient.invalidateQueries([USE_RELATION_KEY, otherUserId]);
        }
      },
    );
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
      socket.off(SOCKET_CONFIG.EVENTS.CLIENT.LIST);
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.LIST);
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.UPDATE);
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.END);
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
