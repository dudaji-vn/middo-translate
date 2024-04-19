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

const tabsMap: Record<RoomSidebarTabs, React.ReactNode> = {
  info: <RoomSideTabInfo />,
  discussion: <RoomSideTabDiscussion />,
  pinned: <RoomSideTabPinned />,
};

export interface RoomSideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomSide = forwardRef<HTMLDivElement, RoomSideProps>(
  (props, ref) => {
    const { currentSide } = useRoomSidebarTabs();
    if (!currentSide) return <></>;
    return (
      <RoomActions>
        <div
          ref={ref}
          {...props}
          className="absolute left-0 top-0 z-50 h-dvh w-screen overflow-y-auto border-l bg-background p-3 pb-0 md:relative md:z-auto md:h-auto md:w-full"
        >
          {tabsMap[currentSide]}
        </div>
      </RoomActions>
    );
  },
);
RoomSide.displayName = 'RoomSide';
