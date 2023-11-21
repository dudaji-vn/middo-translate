import { Participant, Room } from '@/types/room';
import { useEffect, useState } from 'react';

import { MemberList } from './member-list';
import socket from '@/lib/socket-io';
import { socketConfig } from '@/configs/socket';

export interface SideChatBodyProps {
  room: Room;
}

export const SideChatBody = ({ room }: SideChatBodyProps) => {
  const [members, setMembers] = useState<Participant[]>(room.participants);
  useEffect(() => {
    socket.on(socketConfig.events.room.participant.update, (participants) => {
      setMembers(participants);
    });

    return () => {
      socket.off(socketConfig.events.room.participant.update);
    };
  }, []);

  return (
    <div className="bg-background">
      <MemberList hostSocketId={room.hostSocketId} members={members} />
    </div>
  );
};
