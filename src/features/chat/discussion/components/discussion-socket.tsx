import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Message } from '../../messages/types';
import { useDiscussion } from './discussion';

export interface DiscussionSocketProps {}

export const DiscussionSocket = (props: DiscussionSocketProps) => {
  const { message } = useDiscussion();
  const messageId = message._id;
  const queryClient = useQueryClient();
  useEffect(() => {
    socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.JOIN, messageId);

    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.NEW, (message: Message) => {
      queryClient.invalidateQueries(['message-replies', messageId]);
    });
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.UPDATE, (message: Message) => {
      queryClient.invalidateQueries(['message-replies', messageId]);
    });

    return () => {
      // socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
      // socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE);
      socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.LEAVE, messageId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageId]);
  return <></>;
};
