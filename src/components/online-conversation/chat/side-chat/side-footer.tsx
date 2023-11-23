'use client';

import Image from 'next/image';
import { Participant } from '@/types/room';
import { ROUTE_NAMES } from '@/configs/route-name';
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
    <div className="pb-10">
      <button
        onClick={handleLeaveRoom}
        className="w-full bg-background py-4 text-center font-medium text-error"
      >
        Leave room
      </button>
      <div className="mt-10 flex items-center justify-center">
        <div className="">
          <p className="mb-2 font-light ">Power by</p>
          <div className="w-[150px]">
            <Image src="/logo.png" alt="logo" width={500} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
};
