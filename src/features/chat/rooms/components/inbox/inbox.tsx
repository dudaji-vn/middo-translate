'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoomActions } from '../room-actions';
import InboxList from './inbox-list';

import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import {
  ArchiveIcon,
  ContactRoundIcon,
  MessageSquareDashedIcon,
  MessageSquareDot,
  MessagesSquare,
  MessagesSquareIcon,
  UsersRoundIcon,
} from 'lucide-react';
import InboxContactList from './inbox-contact-list';
import { useSearchParams } from 'next/navigation';
import { SPK_FOCUS } from '@/configs/search-param-key';
import Ping from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { useAuthStore } from '@/stores/auth.store';
import { useStationNavigationData } from '@/hooks/use-station-navigation-data';
export interface InboxProps {
  unreadCount?: number;
}
export type InboxType =
  | 'all'
  | 'contact'
  | 'group'
  | 'help-desk'
  | 'unread-help-desk'
  | 'archived'
  | 'waiting';

export const inboxTabMap: Record<
  InboxType,
  {
    label: string;
    value: InboxType;
    icon?: React.ReactNode;
  }
> = {
  all: {
    label: 'COMMON.ALL',
    value: 'all',
    icon: <MessagesSquareIcon className="size-5 md:size-4" />,
  },
  contact: {
    label: 'COMMON.CONTACT',
    value: 'contact',
    icon: <ContactRoundIcon className="size-5 md:size-4" />,
  },
  group: {
    label: 'COMMON.GROUP',
    value: 'group',
    icon: <UsersRoundIcon className="size-5 md:size-4" />,
  },
  archived: {
    label: 'COMMON.ARCHIVE',
    value: 'archived',
    icon: <ArchiveIcon className="size-5 md:size-4" />,
  },
  waiting: {
    label: 'COMMON.WAITING',
    value: 'waiting',
    icon: <MessageSquareDashedIcon className="size-5 md:size-4" />,
  },

  'help-desk': {
    label: 'COMMON.ALL',
    value: 'help-desk',
    icon: <MessagesSquare className="size-5 md:size-4" />,
  },
  'unread-help-desk': {
    label: 'COMMON.UNREAD',
    value: 'unread-help-desk',
    icon: <MessageSquareDot className="size-5 md:size-4" />,
  },
};

const normalInboxTabs = [
  inboxTabMap.all,
  inboxTabMap.contact,
  // inboxTabMap.group,
  inboxTabMap.archived,
  inboxTabMap.waiting,
];
const businessInboxTabs = [
  inboxTabMap['help-desk'],
  inboxTabMap['unread-help-desk'],
];
const stationInboxTabs = [inboxTabMap.all, inboxTabMap.group];

export const Inbox = ({ unreadCount = 0, ...props }: InboxProps) => {
  const { isBusiness } = useBusinessNavigationData();
  const { isOnStation } = useStationNavigationData();
  const { space } = useAuthStore();
  const searchParams = useSearchParams();
  const tabs = useMemo(() => {
    if (isBusiness) {
      return businessInboxTabs;
    }
    if (isOnStation) {
      return stationInboxTabs;
    }
    return normalInboxTabs;
  }, [isBusiness, isOnStation]);
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
  useEffect(() => {
    const focusType = searchParams?.get(SPK_FOCUS) as InboxType;
    if (focusType && tabs.map((tab) => tab.value).includes(focusType)) {
      console.log('focusType', focusType);
      setType(focusType);
    }
  }, [searchParams]);

  console.log('unreadCount', unreadCount);

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
                  className="!rounded-none dark:!text-neutral-50"
                >
                  {type === tab.value ? (
                    <>{t(tab.label)}</>
                  ) : (
                    <div className="relative h-5 ">
                      {tab.value === 'unread-help-desk' &&
                        Number(unreadCount) > 0 && (
                          <Ping size={12} className="absolute -top-2 right-0" />
                        )}
                      {tab?.icon}
                    </div>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {type == 'contact' ? (
            <InboxContactList type={type} />
          ) : (
            <InboxList type={type} />
          )}
        </div>
      </div>
    </RoomActions>
  );
};
