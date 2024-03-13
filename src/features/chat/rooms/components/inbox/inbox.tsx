'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';

import InboxList from './inbox-list';
import { RoomActions } from '../room-actions';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEqual } from 'lodash';
import { usePathname } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { TBusinessExtensionData } from '@/app/(main-layout)/(protected)/business/settings/_components/extenstion/business-extension';
import { useState } from 'react';

export interface InboxProps {
  businessData?: TBusinessExtensionData;
}
export type InboxType = 'all' | 'group' | 'help-desk' | 'unread-help-desk';
export const inboxTabMap: Record<
  InboxType,
  {
    label: string;
    value: InboxType;
  }
> = {
  all: {
    label: 'All',
    value: 'all',
  },
  group: {
    label: 'Group',
    value: 'group',
  },
  'help-desk': {
    label: 'All',
    value: 'help-desk',
  },
  'unread-help-desk': {
    label: 'Unread',
    value: 'unread-help-desk',
  },
};

const normalInboxTabs = [inboxTabMap.all, inboxTabMap.group];
const businessInboxTabs = [inboxTabMap['help-desk'], inboxTabMap['unread-help-desk']];

export const Inbox = ({ businessData }: InboxProps) => {
  const pathname = usePathname();
  const isBusinessConversation = pathname?.includes(ROUTE_NAMES.BUSINESS_CONVERSATION);
  const tabs = isBusinessConversation ? businessInboxTabs : normalInboxTabs;
  const [type, setType] = useState<InboxType>(tabs[0].value);

  useKeyboardShortcut(
    [SHORTCUTS.SWITCH_TO_ALL_TAB, SHORTCUTS.SWITCH_TO_GROUP_TAB],
    (_, mathedKeys) => {
      setType(
        isEqual(mathedKeys, SHORTCUTS.SWITCH_TO_ALL_TAB) ? tabs[0].value : tabs[1].value,
      );
    },
  );

  return (
    <RoomActions>
      <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-background">
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="all" value={type} className="w-full">
            <TabsList>
              {Object.values(tabs).map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  onClick={() => setType(tab.value)}
                  className="!rounded-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <InboxList type={type} businessId={businessData?._id} />
        </div>
      </div>
    </RoomActions>
  );
};
