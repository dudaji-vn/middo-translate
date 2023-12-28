'use client';

import { useEffect, useMemo } from 'react';

import { AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/actions/button';
import { GroupCreateSide } from '../group-creator';
import { InboxSideMain } from './inbox-side.main';
import { InboxSides } from '../../types';
import { IndividualSideCreate } from '../individual-create-side';
import { RoomActions } from '../room.actions';
import { SettingSide } from '../setting-side';
import { Sideslip } from '@/components/animations';
import { Typography } from '@/components/data-display';
import { useChangeInboxSide } from '../../hooks/use-change-inbox-side';

export interface InboxProps {}

type SidesMap = Record<
  InboxSides,
  { component: JSX.Element; title?: string } | null
>;

const sidesMap: SidesMap = {
  settings: {
    title: 'Settings',
    component: <SettingSide />,
  },
  'new-message': {
    title: 'New message',
    component: <IndividualSideCreate />,
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
    <RoomActions>
      <div className="relative flex h-[calc(100dvh_-_56px)] w-full flex-col overflow-hidden border-r bg-background">
        <div className="flex-1 overflow-hidden pt-5">
          <InboxSideMain />
        </div>
        <AnimatePresence>
          {side !== 'default' && (
            <Sideslip className="absolute left-0 top-0 flex h-full w-full flex-col bg-card">
              <div className="flex items-center gap-2 px-1 pt-1">
                <Button.Icon
                  onClick={changeToDefault}
                  variant="ghost"
                  color="default"
                >
                  <ArrowLeftIcon />
                </Button.Icon>
                <Typography variant="default" className="font-semibold">
                  {sidesMap[side]?.title}
                </Typography>
              </div>
              <div className="flex-1 overflow-hidden">
                {sidesMap[side]?.component}
              </div>
            </Sideslip>
          )}
        </AnimatePresence>
      </div>
    </RoomActions>
  );
};
