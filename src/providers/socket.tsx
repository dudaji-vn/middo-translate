'use client';

import React, { useEffect } from 'react';

import socket from '@/lib/socket-io';

const SocketProvider = () => {
  // useEffect(() => {
  //   socket.connect();
  //   // function onConnect() {
  //   //   if (user?._id) {
  //   //     socket.emit('client.join', user._id);
  //   //   }
  //   // }

  //   function onDisconnect() {
  //     console.log('disconnected');
  //   }

  //   // socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);
  //   return () => {
  //     // socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.disconnect();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return <></>;
};

export default SocketProvider;
