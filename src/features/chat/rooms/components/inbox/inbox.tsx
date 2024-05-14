'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';

import InboxList from './inbox-list';
import { RoomActions } from '../room-actions';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import ViewSpaceInboxFilter from './view-space-inbox-filter';
import { cn } from '@/utils/cn';
export interface InboxProps {}
export type InboxType = 'all' | 'group' | 'help-desk' | 'unread-help-desk';

export const inboxTabMap: Record<
  InboxType,
  {
    label: string;
    value: InboxType;
  }
> = {
  all: {
    label: 'COMMON.ALL',
    value: 'all',
  },
  group: {
    label: 'COMMON.GROUP',
    value: 'group',
  },
  'help-desk': {
    label: 'COMMON.ALL',
    value: 'help-desk',
  },
  'unread-help-desk': {
    label: 'COMMON.UNREAD',
    value: 'unread-help-desk',
  },
};

const normalInboxTabs = [inboxTabMap.all, inboxTabMap.group];
const businessInboxTabs = [
  inboxTabMap['help-desk'],
  inboxTabMap['unread-help-desk'],
];

export const Inbox = (props: InboxProps) => {
  const { isBusiness } = useBusinessNavigationData();
  const tabs = isBusiness ? businessInboxTabs : normalInboxTabs;
  const [type, setType] = useState<InboxType>(tabs[0].value);
  const { t } = useTranslation('common');
  useKeyboardShortcut(
    [SHORTCUTS.SWITCH_TO_ALL_TAB, SHORTCUTS.SWITCH_TO_GROUP_TAB],
    (_, matchedKeys) => {
      setType(
        isEqual(matchedKeys, SHORTCUTS.SWITCH_TO_ALL_TAB)
          ? tabs[0].value
          : tabs[1].value,
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
                  {t(tab.label)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <ViewSpaceInboxFilter
            className={cn('w-full', {
              hidden: !isBusiness,
            })}
          />
          <InboxList type={type} />
        </div>
      </div>
    </RoomActions>
  );
};
