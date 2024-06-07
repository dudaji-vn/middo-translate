import { MessagesSquare } from 'lucide-react';
import React from 'react';
import Ping from '../(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { cn } from '@/utils/cn';

const page = () => {
  const hasNotification = true;
  return (
    <div className="relative !h-fit  w-fit  bg-purple-50 ">
      <button className="relative m-2 w-fit rounded-full bg-white p-4 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]">
        <MessagesSquare className={`h-8 w-8 stroke-primary-500-main`} />
      </button>
      <Ping
        size={12}
        className={cn('absolute right-[28px] top-[8px]', {
          hidden: !hasNotification,
        })}
      />
    </div>
  );
};

export default page;
