'use client';

import { MonitorUp, Brush, TextSelect, MessageSquare, Mic, MicOff, Video, VideoOff, Phone, Users2Icon, MoreVertical } from 'lucide-react';
import ButtonDataAction from '@/components/actions/button/button-data-action';
import { useVideoCallStore } from '../store';
import { twMerge } from 'tailwind-merge';
import { useVideoCallContext } from '../context/video-call-context';
import { Fragment, useEffect, useState } from 'react';
import formatTime from '../utils/formatTime';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/data-display';

export interface VideoCallBottomProps { }

export const VideoCallBottom = ({ }: VideoCallBottomProps) => {
    return (
        <section className='p-1 flex justify-between items-center border-b border-neutral-50 border-t'>
            <MeetingInfo />
            <MeetingAction />
            <MeetingControl />
        </section>
    );
};


const MeetingAction = () => {
    const { participants, isShareScreen } = useVideoCallStore();
    const { handleShareScreen } = useVideoCallContext();
    const haveShareScreen = participants.some((participant) => participant.isShareScreen);
    const [isOpenMenuSelectLayout, setMenuSelectLayout] = useState(false);

    return (
        <Fragment>
            <div className='md:gap-8 gap-1 hidden md:flex'>
                <ButtonDataAction
                    className={twMerge('rounded-full px-3 py-3', (isShareScreen || haveShareScreen) ? 'opacity-50' : 'hover:bg-primary-100')}
                    onClick={handleShareScreen}
                >
                    <MonitorUp className='w-6 h-6' />
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    <Brush className='w-6 h-6' />
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    <MessageSquare className='w-6 h-6' />
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    <TextSelect className='w-6 h-6' />
                </ButtonDataAction>
            </div>
            <div className='block md:hidden'>
                <DropdownMenu open={isOpenMenuSelectLayout} onOpenChange={() => setMenuSelectLayout(prev => !prev)}>
                    <DropdownMenuTrigger>
                        <ButtonDataAction className='rounded-full px-3 py-3'>
                            <MoreVertical className='w-6 h-6' />
                        </ButtonDataAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3 ml-1"
                        onClick={() => setMenuSelectLayout(prev => !prev)}
                    >
                        <ButtonDataAction
                            className={twMerge('rounded-full px-3 py-3', (isShareScreen || haveShareScreen) ? 'opacity-50' : 'hover:bg-primary-100')}
                            onClick={handleShareScreen}
                        >
                            <MonitorUp className='w-6 h-6 mr-2' />
                            Share screen
                        </ButtonDataAction>
                        <ButtonDataAction className='rounded-full px-3 py-3'>
                            <Brush className='w-6 h-6 mr-2' />
                            Doodle
                        </ButtonDataAction>
                        <ButtonDataAction className='rounded-full px-3 py-3'>
                            <MessageSquare className='w-6 h-6 mr-2' />
                            Open chat
                        </ButtonDataAction>
                        <ButtonDataAction className='rounded-full px-3 py-3'>
                            <TextSelect className='w-6 h-6 mr-2' />
                            Show caption
                        </ButtonDataAction>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Fragment>
    )
}

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
        }
    }, [room])
    return (
        <div className='hidden md:flex gap-2 md:w-[160px] h-fit items-center'>
            <ButtonDataAction>
                <Users2Icon className='w-5 h-5 mr-2' />
                <span>{participants.length || 0}</span>
            </ButtonDataAction>
            <ButtonDataAction>{formatTime(meetingTime)}</ButtonDataAction>
        </div>
    )
}

const MeetingControl = () => {
    const { setConfirmLeave } = useVideoCallStore();
    const handleLeave = () => {
        setConfirmLeave(true)
    }
    return (
        <div className='flex gap-2'>
            <ButtonDataAction className='rounded-full px-3 py-3'>
                {/* <Video className='w-6 h-6'/> */}
                <VideoOff className='w-6 h-6' />
            </ButtonDataAction>
            <ButtonDataAction className='rounded-full px-3 py-3'>
                <Mic className='w-6 h-6' />
                {/* <MicOff className='w-6 h-6'/> */}
            </ButtonDataAction>
            <ButtonDataAction className='rounded-full px-3 py-3 bg-error-2 md:hover:bg-red-500' title="Leave" onClick={handleLeave}>
                <Phone className='w-6 h-6 stroke-white rotate-[135deg]' />
            </ButtonDataAction>
        </div>
    )
}