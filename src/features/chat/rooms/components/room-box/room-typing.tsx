'use client';
import { useEffect, useState } from 'react';
import { useChatBox } from '../../contexts';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';

export interface RoomTypingProps {}

type TypingData = {
  userId: string;
  isTyping: boolean;
};

export const RoomTyping = (props: RoomTypingProps) => {
  const [usersTyping, setUsersTyping] = useState<User[]>([]);
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { room } = useChatBox();
  const participants = room.participants;
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.TYPING.UPDATE.CLIENT, (data: TypingData) => {
      if (data.isTyping) {
        setUsersTyping((prev) => {
          const newUser = participants.find(
            (user) => user._id === data.userId && user._id !== currentUserId,
          );
          if (newUser) {
            return [...prev, newUser];
          }
          return prev;
        });
      } else {
        setUsersTyping((prev) => {
          return prev.filter((user) => user._id !== data.userId);
        });
      }
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.TYPING.UPDATE.CLIENT);
    };
  }, [currentUserId, participants, room._id]);
  if (usersTyping.length === 0) return null;
  return (
    <div className="flex p-1 pl-3 text-sm text-neutral-600">
      {usersTyping.map((user, index) => (
        <div key={user._id} className="font-semibold">
          {user.name}
          {index !== usersTyping.length - 1 ? ', ' : ''}
        </div>
      ))}
      <span>&nbsp;is typing ...</span>
    </div>
  );
};
