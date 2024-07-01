'use client';

import { Avatar } from '@/components/data-display';
import { BellOffIcon } from 'lucide-react';
import React from 'react';

const RoomItemVisitorAvatar = ({
  isOnline,
  isMuted,
}: {
  isOnline?: boolean;
  isMuted?: boolean;
}) => {
  return (
    <div className="relative">
      <Avatar src={'/anonymous_avt.png'} alt="anonymous-avt" />
      {isOnline && (
        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-white p-[2.4px] dark:bg-neutral-950">
          <div className="h-full w-full rounded-full bg-success" />
        </div>
      )}
      {/* {isMuted && (
        <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-error-100 ">
          <BellOffIcon size={12} className="text-error" />
        </div>
      )} */}
    </div>
  );
};

export default RoomItemVisitorAvatar;
