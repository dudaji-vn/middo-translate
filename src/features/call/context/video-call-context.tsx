'use client';

import { PropsWithChildren } from 'react';

export const VideoCallProvider = ({ children } : PropsWithChildren) => {
//   useEffect(() => {
//     socket.emit(SOCKET_CONFIG.EVENTS.CHAT.JOIN, room._id);
//     return () => {
//       socket.emit(SOCKET_CONFIG.EVENTS.CHAT.LEAVE, room._id);
//     };
//   }, [room._id]);

//   useEffect(() => {
//     socket.on(SOCKET_CONFIG.EVENTS.ROOM.UPDATE, updateRoom);
//     socket.on(SOCKET_CONFIG.EVENTS.ROOM.DELETE, handleForceLeaveRoom);
//     socket.on(SOCKET_CONFIG.EVENTS.ROOM.LEAVE, handleForceLeaveRoom);
//     return () => {
//       socket.off(SOCKET_CONFIG.EVENTS.ROOM.UPDATE, updateRoom);
//       socket.off(SOCKET_CONFIG.EVENTS.ROOM.DELETE);
//       socket.off(SOCKET_CONFIG.EVENTS.ROOM.LEAVE);
//     };
//   }, [handleForceLeaveRoom, room._id, updateRoom]);

  return (
    <>
      {children}
    </>
  );
};


