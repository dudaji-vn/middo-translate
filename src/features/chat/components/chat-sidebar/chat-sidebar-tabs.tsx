import React, { forwardRef } from 'react';

import { AnimatePresence } from 'framer-motion';
import { GroupTab } from './chat-sidebar-tab-group';
import { IndividualTab } from './chat-sidebar-tab-individual';
import { SearchTab } from './chat-sidebar-tab-search-v2';
import { SidebarTabs } from '../../types';
import { useSideChatStore } from '../../stores/side-chat.store';
import { StationSettingTab } from './chat-sidebar-station-settings';
export interface ChatSidebarTabsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const tabMap: Record<
  SidebarTabs,
  {
    component: JSX.Element | null;
  }
> = {
  search: {
    component: <SearchTab />,
  },
  group: {
    component: <GroupTab />,
  },
  individual: {
    component: <IndividualTab />,
  },
  station_settings: {
    component: <StationSettingTab />,
  },
};

export const ChatSidebarTabs = forwardRef<HTMLDivElement, ChatSidebarTabsProps>(
  ({ children, ...props }, ref) => {
    const { currentSide } = useSideChatStore();

    return (
      <>
        <div
          ref={ref}
          {...props}
          className="relative flex flex-1 flex-col overflow-hidden"
        >
          {children}
        </div>
        <AnimatePresence>
          {tabMap[currentSide as SidebarTabs]?.component}
        </AnimatePresence>
      </>
    );
  },
);
ChatSidebarTabs.displayName = 'ChatSidebarTabs';
