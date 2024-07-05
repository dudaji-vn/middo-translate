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
      <div className="absolute left-0 top-0 flex  min-w-[30%] -translate-y-full overflow-hidden rounded-tr-xl bg-gradient-to-r from-white to-white/0 px-3 py-1 text-sm font-light text-neutral-600 backdrop-blur-sm dark:from-neutral-950 dark:to-transparent dark:text-neutral-50">
        <span>
          <span className="font-normal">{actor}</span> {verb}&nbsp;
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
