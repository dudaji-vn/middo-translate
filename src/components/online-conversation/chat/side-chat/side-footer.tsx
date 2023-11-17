'use client';

import { Participant } from '@/types/room';
import { ROUTE_NAMES } from '@/configs/route-name';
import { leaveConversation } from '@/services/conversation';
import { useRouter } from 'next/navigation';

export interface SideChatFooterProps {
  roomCode: string;
  user: Participant;
}

export const SideChatFooter = ({ roomCode, user }: SideChatFooterProps) => {
  const router = useRouter();
  const handleLeaveRoom = async () => {
    router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
  };
  return (
    <div className="">
      <button
        onClick={handleLeaveRoom}
        className="w-full bg-background py-4 text-center font-medium text-error"
      >
        Leave room
      </button>
      <div className="mt-10 flex items-center justify-center">
        <div className="">
          <p className="mb-2 font-light ">Power by</p>
          <img src="/logo.png" alt="qr-code" width={150} />
        </div>
      </div>
    </div>
  );
};
