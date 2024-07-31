'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEmpty, isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoomActions } from '../room-actions';
import InboxList from './inbox-list';

import Ping from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { SPK_FOCUS } from '@/configs/search-param-key';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useStationNavigationData } from '@/hooks/use-station-navigation-data';
import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import {
  ArchiveIcon,
  ContactRoundIcon,
  MessageSquareDashedIcon,
  MessageSquareDot,
  MessagesSquare,
  MessagesSquareIcon,
  SettingsIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCountWaitingRooms } from '../../hooks/use-count-waiting-rooms';
import InboxContactList from './inbox-contact-list';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
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
  | 'waiting'
  | 'settings';

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
  settings: {
    label: 'COMMON.SETTINGS',
    value: 'settings',
    icon: <SettingsIcon className="size-5 md:size-4" />,
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
const stationInboxTabs = [inboxTabMap.all, inboxTabMap.archived];

export const Inbox = ({ unreadCount, ...props }: InboxProps) => {
  const { isBusiness } = useBusinessNavigationData();
  const { isOnStation } = useStationNavigationData();
  const { data, refetch } = useCountWaitingRooms();
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
  const { appliedFilters } = useSpaceInboxFilterStore();
  const [notifications, setNotifications] = useState<
    Partial<Record<InboxType, boolean>>
  >({
    'unread-help-desk': unreadCount ? true : false,
  });
  const { t } = useTranslation('common');
  useKeyboardShortcut(
    [SHORTCUTS.SWITCH_TO_ALL_TAB, SHORTCUTS.SWITCH_TO_GROUP_TAB],
    (_, matchedKeys) => {
      if (isBusiness) return;
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
      setType(focusType);
    }
  }, [searchParams, tabs]);
  const updateNotification = (type: InboxType, ping?: boolean) => {
    if (notifications[type] === ping) return;
    setNotifications((prev) => ({
      ...prev,
      [type]: ping,
    }));
  };

  useEffect(() => {
    setNotifications((prev) => ({
      ...prev,
      waiting: data?.count ? true : false,
    }));
  }, [data?.count]);
  console.log(data?.count);
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.WAITING_UPDATE, (data) => {
      refetch();
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.WAITING_UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderList = () => {
    switch (type) {
      case 'contact':
        return <InboxContactList type={type} />;
      default:
        return <InboxList type={type} notifyToTab={updateNotification} />;
    }
  };

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
                  onClick={() => {
                    setType(tab.value);
                  }}
                  className="!rounded-none dark:!text-neutral-50"
                >
                  {type === tab.value ? (
                    <>{t(tab.label)}</>
                  ) : (
                    <div className="relative h-5 ">
                      {notifications[tab.value] &&
                        isEmpty(
                          Object.values(appliedFilters || {})?.flat(),
                        ) && (
                          <Ping size={12} className="absolute -top-2 right-0" />
                        )}
                      {tab?.icon}
                    </div>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {renderList()}
        </div>
      </div>
    </RoomActions>
  );
};
