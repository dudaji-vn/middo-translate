'use client';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { GET_STATION_DATA_KEY } from '../hooks/use-get-station';

export interface StationSocketProps {}

export const StationSocket = (props: StationSocketProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refreshStationData = () => {
      console.log('refreshStationData');
      queryClient.invalidateQueries({
        queryKey: [GET_STATION_DATA_KEY],
      });
    };
    socket.on(SOCKET_CONFIG.EVENTS.STATION.MEMBER.UPDATE, refreshStationData);
    socket.on(SOCKET_CONFIG.EVENTS.STATION.MEMBER.LEAVE, refreshStationData);
    socket.on(SOCKET_CONFIG.EVENTS.STATION.MEMBER.REMOVE, refreshStationData);
    socket.on(SOCKET_CONFIG.EVENTS.STATION.UPDATE, refreshStationData);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.STATION.MEMBER.UPDATE);
      socket.off(SOCKET_CONFIG.EVENTS.STATION.MEMBER.LEAVE);
      socket.off(SOCKET_CONFIG.EVENTS.STATION.MEMBER.REMOVE);
      socket.off(SOCKET_CONFIG.EVENTS.STATION.UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
