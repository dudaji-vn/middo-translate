'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';

import { ArrowBackOutline } from '@easy-eva-icons/react';
import { Button } from '@/components/actions/button';
import { GroupCreateSide } from '../group-create-side';
import { InboxMainSide } from './inbox-main-side';
import { InboxSides } from '../../types';
import { PrivateCreateSide } from '../private-create-side';
import { SettingSide } from '../setting-side';
import { Typography } from '@/components/data-display';
import { useChangeInboxSide } from '../../hooks/use-change-inbox-side';

export interface InboxProps {}

const sidesMap: Record<
  InboxSides,
  {
    component: JSX.Element;
    title?: string;
  } | null
> = {
  settings: {
    title: 'Settings',
    component: <SettingSide />,
  },
  'new-message': {
    title: 'New message',
    component: <PrivateCreateSide />,
  },
  'new-group': {
    title: 'Group chat',
    component: <GroupCreateSide />,
  },
  default: null,
};

export const Inbox = (props: InboxProps) => {
  const { currentSide, changeToDefault } = useChangeInboxSide();
  let side = useMemo(() => {
    if (currentSide && sidesMap[currentSide]) return currentSide;
    return 'default';
  }, [currentSide]);

  useEffect(() => {
    if (side === 'default') {
      changeToDefault();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden border-r bg-card">
      <div className="flex-1 overflow-hidden pt-5">
        <InboxMainSide />
      </div>
      <AnimatePresence>
        {side !== 'default' && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-0 flex h-full w-full flex-col bg-card"
          >
            <div className="flex items-center gap-2 px-5 pt-3">
              <Button.Icon
                onClick={changeToDefault}
                variant="ghost"
                color="default"
              >
                <ArrowBackOutline />
              </Button.Icon>
              <Typography variant="default" className="font-semibold">
                {sidesMap[side]?.title}
              </Typography>
            </div>
            <div className="flex-1 overflow-hidden">
              {sidesMap[side]?.component}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
