'use client';

import { useParams, usePathname } from 'next/navigation';

import { PropsWithChildren } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';
import { useRequirePushNotify } from '@/hooks/use-require-push-notify';

export interface ChatLeftSideProps {}

export const ChatLeftSide = ({
  children,
}: ChatLeftSideProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const pathName = usePathname();
  const params = useParams();

  const isInRoom =
    pathName?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && !!params?.id;

  const showSide = !isMobile || !isInRoom;

  useRequirePushNotify();

  return (
    // <AnimatePresence initial={false}>
    <>
      {showSide && (
        <div
          // initial={{ x: '-100%' }}
          // animate={{ x: 0 }}
          // exit={{ x: '-100%' }}
          className="w-full min-w-[320px] md:basis-1/4"
        >
          {children}
        </div>
      )}
    </>
    // </AnimatePresence>
  );
};
