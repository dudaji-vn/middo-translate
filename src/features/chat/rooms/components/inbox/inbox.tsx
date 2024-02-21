'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';

import InboxList from './inbox-list';
import { RoomActions } from '../room-actions';
import { useCallback, useState } from 'react';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';

export interface InboxProps {}
export type InboxType = 'all' | 'group';
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
};

const SHORTCUT_SWITCH_TABS = [['shift', 'a'], ['shift', 'g']];
export const Inbox = (props: InboxProps) => {
  const [type, setType] = useState<InboxType>('all');

  useKeyboardShortcut(SHORTCUT_SWITCH_TABS, (e) => {
    if(!e) return;
    setType(e.key.toLowerCase() === 'a' ? 'all' : 'group');
  });

  return (
    <RoomActions>
      <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-background">
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="all" value={type} className="w-full">
            <TabsList>
              {Object.values(inboxTabMap).map((tab) => (
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
          <InboxList type={type} />
        </div>
      </div>
    </RoomActions>
  );
};
