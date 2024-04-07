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
  const isMoreThanOne = usersTyping.length > 1;
  const actor = isMoreThanOne
    ? `${usersTyping.length} people`
    : usersTyping[0].name;
  const verb = isMoreThanOne ? 'are' : 'is';
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 flex -translate-y-full bg-white  p-1 pl-3 text-sm text-neutral-600">
        <span>
          <span className="font-semibold">{actor}</span> {verb}&nbsp;
        </span>
        <span>
          typing&nbsp;
          <div className="inline-flex space-x-[1.5px]">
            <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.2s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.1s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500"></div>
          </div>
        </span>
      </div>
    </div>
  );
};
