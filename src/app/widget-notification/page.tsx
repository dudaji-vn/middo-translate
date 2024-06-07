import { MessagesSquare } from 'lucide-react';
import React from 'react';
import Ping from '../(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { cn } from '@/utils/cn';

const page = ({
  searchParams,
}: {
  searchParams: {
    businessId: string;
    domain?: string;
  };
}) => {
  const hasNotification = true;
  return (
    <div className="relative flex  h-screen w-screen flex-row items-end justify-end   bg-purple-100">
      <button className="relative m-2 w-fit rounded-full bg-white p-4 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]">
        <Ping
          size={16}
          className={cn('absolute right-4 top-0', {
            hidden: !hasNotification,
          })}
        />
        <MessagesSquare className={`h-8 w-8 stroke-primary-500-main`} />
      </button>
    </div>
  );
};

export default page;
