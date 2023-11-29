'use client';

import { useEffect, useMemo } from 'react';

import { ArrowBackOutline } from '@easy-eva-icons/react';
import { Button } from '@/components/actions/button';
import { ChatCreator } from '@/features/chat/rooms/components/inbox-create/chat-creator';
import { ChatSetting } from '../chat-setting';
import { GroupCreator } from '../inbox-create/group-creator';
import { InboxMainTab } from './inbox-main-tab';
import { MessagePlusIcon } from '@/components/icons';
import { Typography } from '@/components/data-display';
import { useSetParams } from '@/hooks/use-set-params';

export interface InboxProps {}

export type InboxTabs = 'default' | 'settings' | 'new-message' | 'new-group';

const componentsMap: Record<
  InboxTabs,
  {
    component: JSX.Element;
    title?: string;
  } | null
> = {
  settings: {
    title: 'Settings',
    component: <ChatSetting />,
  },
  'new-message': {
    title: 'New message',
    component: <ChatCreator />,
  },
  'new-group': {
    title: 'Group chat',
    component: <GroupCreator />,
  },
  default: null,
};

export const Inbox = (props: InboxProps) => {
  const { setParam, searchParams, removeParam } = useSetParams();
  let mode = useMemo(() => {
    const paramMode = searchParams?.get('mode');
    if (paramMode && componentsMap[paramMode as InboxTabs]) {
      return paramMode as InboxTabs;
    } else {
      return 'default';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (mode === 'default') {
      removeParam('mode');
    }
  }, [mode, removeParam]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden border-r bg-card">
      <div className="flex-1 overflow-hidden pt-5">
        <InboxMainTab />
      </div>
      {mode !== 'new-message' && (
        <div className="absolute bottom-14 right-5">
          <Button.Icon
            size="lg"
            onClick={() => setParam('mode', 'new-message')}
            className="shadow-3"
          >
            <MessagePlusIcon />
          </Button.Icon>
        </div>
      )}
      {mode !== 'default' && (
        <div className="absolute left-0 top-0 flex h-full w-full flex-col bg-card">
          <div className="flex items-center gap-2 px-5 pt-4">
            <Button.Icon
              onClick={() => removeParam('mode')}
              size="lg"
              variant="ghost"
              className="-ml-2"
            >
              <ArrowBackOutline />
            </Button.Icon>
            <Typography variant="default" className="font-semibold">
              {componentsMap[mode]?.title}
            </Typography>
          </div>
          <div className="flex-1 overflow-hidden">
            {componentsMap[mode]?.component}
          </div>
        </div>
      )}
    </div>
  );
};
