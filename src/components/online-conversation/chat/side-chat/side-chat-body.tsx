import { Participant, Room } from '@/types/room';
import { useEffect, useState } from 'react';

import { MemberList } from './member-list';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';

export interface SideChatBodyProps {
  room: Room;
}

export const SideChatBody = ({ room }: SideChatBodyProps) => {
  const [members, setMembers] = useState<Participant[]>(room.participants);
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.PARTICIPANT.UPDATE, (participants) => {
      setMembers(participants);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.PARTICIPANT.UPDATE);
    };
  }, []);

  return (
    <div className="bg-background">
      <MemberList host={room.host} members={members} />
    </div>
  );
};
