'use client';

import { useParams, usePathname } from 'next/navigation';

import { Sideslip } from '@/components/animations';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { AnimatePresence } from 'framer-motion';
import { PropsWithChildren } from 'react';
export interface ChatMainProps {}

export const ChatMain = ({ children }: ChatMainProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const pathName = usePathname();

  const params = useParams();

  const isInRoom =
    (pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) ||
      pathName?.includes(ROUTE_NAMES.STATIONS)) &&
    !!params?.id;

  const show = !isMobile || isInRoom;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {show && (
        <Sideslip
          className={cn(
            isMobile
              ? 'full-screen-height fixed left-0 top-0 z-50 w-screen overflow-hidden'
              : 'container-height',
          )}
        >
          {children}
        </Sideslip>
      )}
    </AnimatePresence>
  );
};
