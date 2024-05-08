import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useEffect } from 'react';
import { Message } from '../../messages/types';
import { useDiscussion } from './discussion';

export interface DiscussionSocketProps {}

export const DiscussionSocket = (props: DiscussionSocketProps) => {
  const { message, replaceReply, updateReply } = useDiscussion();
  const messageId = message._id;
  useEffect(() => {
    socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.JOIN, messageId);

    socket.on(
      SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.NEW,
      ({
        message,
        clientTempId,
      }: {
        message: Message;
        clientTempId: string;
      }) => {
        replaceReply(message, clientTempId);
      },
    );
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.UPDATE, (message: Message) => {
      updateReply(message);
    });

    return () => {
      socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.LEAVE, messageId);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.NEW);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageId]);
  return <></>;
};
