import React, { forwardRef } from 'react';

import { GroupCreateTab } from './chat-sidebar.tabs.group-create';
import { SearchTab } from './chat-sidebar.tabs.search';
import { SidebarTabs } from '../../types';
import { useSidebarTabs } from '../../hooks';

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
  createGroup: {
    component: <GroupCreateTab />,
  },
};

export const ChatSidebarTabs = forwardRef<HTMLDivElement, ChatSidebarTabsProps>(
  ({ children, ...props }, ref) => {
    const { currentSide } = useSidebarTabs();
    return (
      <div ref={ref} {...props} className="relative flex flex-1 flex-col">
        {children}
        {tabMap[currentSide]?.component}
      </div>
    );
  },
);
ChatSidebarTabs.displayName = 'ChatSidebarTabs';
