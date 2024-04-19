'use client';

import { useParams, usePathname } from 'next/navigation';

import { PropsWithChildren } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { RoomActions } from '../rooms/components/room-actions';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';

export interface ChatMainProps {}

export const ChatMain = ({ children }: ChatMainProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const pathName = usePathname();
  const params = useParams();

  const isInRoom =
    pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && !!params?.id;

  const show = !isMobile || isInRoom;

  return (
    // <AnimatePresence initial={false}>
    <>
      {show && (
        <div
          // initial={{ x: '100%' }}
          // animate={{ x: 0 }}
          // exit={{ x: '100%' }}
          className={cn(
            isMobile
              ? 'absolute left-0 top-0 z-50 h-dvh w-screen'
              : 'h-main-container-height',
          )}
        >
          {children}
        </div>
      )}
    </>
    // </AnimatePresence>
  );
};
