'use client';
import { forwardRef } from 'react';
import { RoomActions } from '../room-actions';
import { RoomSideTabInfo } from './room-side-tab-info';
import {
  RoomSidebarTabs,
  useRoomSidebarTabs,
} from './room-side-tabs/room-side-tabs.hook';
import { RoomSideTabDiscussion } from './room-side-tab-discussion';
import { RoomSideTabPinned } from './room-side-tabs/room-side-tab-pinned';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { AnimatePresence } from 'framer-motion';
import { Sideslip } from '@/components/animations';
import { RoomSideTabFiles } from './room-side-tab-files';

const tabsMap: Record<RoomSidebarTabs, React.ReactNode> = {
  info: <RoomSideTabInfo />,
  discussion: <RoomSideTabDiscussion />,
  pinned: <RoomSideTabPinned />,
  files: <RoomSideTabFiles />,
};

export interface RoomSideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomSide = forwardRef<HTMLDivElement, RoomSideProps>(
  (props, ref) => {
    const { currentSide } = useRoomSidebarTabs();
    const isMobile = useAppStore((state) => state.isMobile);
    return (
      <AnimatePresence>
        {currentSide && (
          <RoomActions>
            <Sideslip
              ref={ref}
              {...props}
              className={cn(
                'absolute left-0 top-0 z-50 w-screen overflow-y-auto border-l bg-[#fcfcfc] dark:bg-background p-3 pb-0 md:relative md:z-auto md:w-full',
                isMobile ? 'full-screen-height' : 'container-height',
              )}
            >
              {tabsMap[currentSide]}
            </Sideslip>
          </RoomActions>
        )}
      </AnimatePresence>
    );
  },
);
RoomSide.displayName = 'RoomSide';
