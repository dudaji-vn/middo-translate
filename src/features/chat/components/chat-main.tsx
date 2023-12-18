'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useParams, usePathname } from 'next/navigation';

import { PropsWithChildren } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import { useMediaQuery } from 'usehooks-ts';

export interface ChatMainProps {}

export const ChatMain = ({ children }: ChatMainProps & PropsWithChildren) => {
  const isMobileOrTablet = useMediaQuery('(max-width: 768px)');
  const pathName = usePathname();
  const params = useParams();

  const isInRoom =
    pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && !!params?.id;

  const show = !isMobileOrTablet || isInRoom;

  return (
    // <AnimatePresence initial={false}>
    <>
      {show && (
        <div
          // initial={{ x: '100%' }}
          // animate={{ x: 0 }}
          // exit={{ x: '100%' }}
          className={cn(
            'flex-1',
            isMobileOrTablet
              ? 'absolute left-0 top-0 z-50 h-screen'
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
