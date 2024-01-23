'use client';

import { Button } from '@/components/actions';
import { ArrowLeft, PinIcon } from 'lucide-react';
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
    const { currentSide, changeToDefault } = useRoomSidebarTabs();
    if (!currentSide) return <></>;
    return (
      <RoomActions>
        <div
          ref={ref}
          {...props}
          className="absolute left-0 top-0 z-50 h-screen w-screen overflow-y-auto border-l bg-background p-3 md:relative md:z-auto md:h-auto md:w-[26.5rem]"
        >
          <div className="-mx-3 -mt-3 px-1 pt-2 md:hidden">
            <Button.Icon
              onClick={changeToDefault}
              variant="ghost"
              color="default"
            >
              <ArrowLeft />
            </Button.Icon>
          </div>
          {tabsMap[currentSide]}
        </div>
      </RoomActions>
    );
  },
);
RoomSide.displayName = 'RoomSide';
