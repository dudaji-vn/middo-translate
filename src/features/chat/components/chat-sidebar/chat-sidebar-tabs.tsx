import React, { forwardRef } from 'react';

import { AnimatePresence } from 'framer-motion';
import { GroupTab } from './chat-sidebar-tab-group';
import { IndividualTab } from './chat-sidebar-tab-individual';
import { SearchTab } from './chat-sidebar-tab-search';
import { SidebarTabs } from '../../types';
import { useSidebarTabs } from '../../hooks';
import { usePathname } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
export interface ChatSidebarTabsProps
  extends React.HTMLAttributes<HTMLDivElement> { }

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

};


export const ChatSidebarTabs = forwardRef<HTMLDivElement, ChatSidebarTabsProps>(
  ({ children, ...props }, ref) => {
    const { currentSide } = useSidebarTabs();

    return (
      <>
        <div
          ref={ref}
          {...props}
          className="relative flex flex-1 flex-col overflow-hidden"
        >
          {children}
        </div>
        <AnimatePresence>{tabMap[currentSide]?.component}</AnimatePresence>
      </>
    );
  },
);
ChatSidebarTabs.displayName = 'ChatSidebarTabs';
