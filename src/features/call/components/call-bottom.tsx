'use client';

import {
  Brush,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreVertical,
  Phone,
  TextSelect,
  Users2Icon,
  Video,
  VideoOff,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Fragment, useEffect, useState } from 'react';

import ButtonDataAction from '@/components/actions/button/button-data-action';
import formatTime from '../utils/formatTime';
import { twMerge } from 'tailwind-merge';
import { useVideoCallContext } from '../context/video-call-context';
import { useVideoCallStore } from '../store';

export interface VideoCallBottomProps {}

export const VideoCallBottom = ({}: VideoCallBottomProps) => {
  return (
    <section className="flex items-center justify-between border-b border-t border-neutral-50 p-1">
      <MeetingInfo />
      <MeetingAction />
      <MeetingControl />
    </section>
  );
};

const MeetingAction = () => {
  const { participants, isShareScreen } = useVideoCallStore();
  const { handleShareScreen } = useVideoCallContext();
  const haveShareScreen = participants.some(
    (participant) => participant.isShareScreen,
  );
  const [isOpenMenuSelectLayout, setMenuSelectLayout] = useState(false);

  return (
    <Fragment>
      <div className="hidden gap-1 md:flex md:gap-8">
        <ButtonDataAction
          className={twMerge(
            'rounded-full px-3 py-3',
            isShareScreen || haveShareScreen
              ? 'opacity-50'
              : 'hover:bg-primary-100',
          )}
          onClick={handleShareScreen}
        >
          <MonitorUp className="h-6 w-6" />
        </ButtonDataAction>
        <ButtonDataAction className="rounded-full px-3 py-3">
          <Brush className="h-6 w-6" />
        </ButtonDataAction>
        <ButtonDataAction className="rounded-full px-3 py-3">
          <MessageSquare className="h-6 w-6" />
        </ButtonDataAction>
        <ButtonDataAction className="rounded-full px-3 py-3">
          <TextSelect className="h-6 w-6" />
        </ButtonDataAction>
      </div>
      <div className="block md:hidden">
        <DropdownMenu
          open={isOpenMenuSelectLayout}
          onOpenChange={() => setMenuSelectLayout((prev) => !prev)}
        >
          <DropdownMenuTrigger>
            <ButtonDataAction className="rounded-full px-3 py-3">
              <MoreVertical className="h-6 w-6" />
            </ButtonDataAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="ml-1 overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
            onClick={() => setMenuSelectLayout((prev) => !prev)}
          >
            <ButtonDataAction
              className={twMerge(
                'rounded-full px-3 py-3',
                isShareScreen || haveShareScreen
                  ? 'opacity-50'
                  : 'hover:bg-primary-100',
              )}
              onClick={handleShareScreen}
            >
              <MonitorUp className="mr-2 h-6 w-6" />
              Share screen
            </ButtonDataAction>
            <ButtonDataAction className="rounded-full px-3 py-3">
              <Brush className="mr-2 h-6 w-6" />
              Doodle
            </ButtonDataAction>
            <ButtonDataAction className="rounded-full px-3 py-3">
              <MessageSquare className="mr-2 h-6 w-6" />
              Open chat
            </ButtonDataAction>
            <ButtonDataAction className="rounded-full px-3 py-3">
              <TextSelect className="mr-2 h-6 w-6" />
              Show caption
            </ButtonDataAction>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Fragment>
  );
};

const MeetingInfo = () => {
  const { participants, room } = useVideoCallStore();
  const [meetingTime, setMeetingTime] = useState(0);
  useEffect(() => {
    if (!room) return;
    const startedAt = new Date(room.createdAt);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startedAt.getTime();
      setMeetingTime(diff);
    }, 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [room]);
  return (
    <div className="hidden h-fit items-center gap-2 md:flex md:w-[160px]">
      <ButtonDataAction>
        <Users2Icon className="mr-2 h-5 w-5" />
        <span>{participants.length || 0}</span>
      </ButtonDataAction>
      <ButtonDataAction>{formatTime(meetingTime)}</ButtonDataAction>
    </div>
  );
};

const MeetingControl = () => {
  const { setConfirmLeave } = useVideoCallStore();
  const handleLeave = () => {
    setConfirmLeave(true);
  };
  return (
    <div className="flex gap-2">
      <ButtonDataAction className="rounded-full px-3 py-3">
        {/* <Video className='w-6 h-6'/> */}
        <VideoOff className="h-6 w-6" />
      </ButtonDataAction>
      <ButtonDataAction className="rounded-full px-3 py-3">
        <Mic className="h-6 w-6" />
        {/* <MicOff className='w-6 h-6'/> */}
      </ButtonDataAction>
      <ButtonDataAction
        className="rounded-full bg-error px-3 py-3 md:hover:bg-red-500"
        title="Leave"
        onClick={handleLeave}
      >
        <Phone className="h-6 w-6 rotate-[135deg] stroke-white" />
      </ButtonDataAction>
    </div>
  );
};
