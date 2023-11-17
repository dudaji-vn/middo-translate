import { Participant, Room } from '@/types/room';
import { useEffect, useState } from 'react';

import { MemberList } from './member-list';
import { pusherClient } from '@/lib/pusher-client';

export interface SideChatBodyProps {
  room: Room;
}

export const SideChatBody = ({ room }: SideChatBodyProps) => {
  const [members, setMembers] = useState<Participant[]>(room.participants);
  useEffect(() => {
    const channel = pusherClient.subscribe(room.code);
    channel.bind('member_join', (member: Participant) => {
      setMembers((prev) => [...prev, member]);
    });

    channel.bind('member_leave', (member: Participant) => {
      setMembers((prev) =>
        prev.filter((user) => user.socketId !== member.socketId),
      );
    });
    return () => {
      channel.unbind('member_join');
      channel.unbind('member_leave');
    };
  }, [room.code]);

  return (
    <div className="bg-background">
      <MemberList hostSocketId={room.hostSocketId} members={members} />
    </div>
  );
};
