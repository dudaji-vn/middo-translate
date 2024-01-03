'use client';

import { MoreVertical, MonitorUp, Brush, TextSelect, MessageSquare, Mic, MicOff, Video, VideoOff, Phone, Users2Icon } from 'lucide-react';
import ButtonDataAction from '@/components/actions/button/button-data-action';
import { useVideoCallStore } from '../store';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '@/stores/auth';
import socket from '@/lib/socket-io';
import { createPeer } from '../utils/peerAction';
import { useVideoCallContext } from '../context/video-call-context';
import { useEffect, useState } from 'react';
import formatTime from '../utils/formatTime';

export interface VideoCallBottomProps { }

export const VideoCallBottom = ({ }: VideoCallBottomProps) => {
    const [meetingTime, setMeetingTime] = useState(0);
    const { participants, isShareScreen, room } = useVideoCallStore();
    const { handleShareScreen } = useVideoCallContext();

    useEffect(()=>{
        if(!room) return;
        const startedAt = new Date(room.startedAt);
        const interval = setInterval(()=>{
            const now = new Date();
            const diff = now.getTime() - startedAt.getTime();
            setMeetingTime(diff);
        },1000);
        return ()=>{
            if(interval) clearInterval(interval);
        }
    },[room])

    
    return (
        <section className='p-1 flex justify-between items-center border-b border-neutral-50 border-t'>
            <div className='flex gap-2 w-[160px] h-fit items-center'>
                <ButtonDataAction>
                    <Users2Icon className='w-5 h-5 mr-2'/>
                    <span>{participants.length || 0}</span>
                </ButtonDataAction>
                <ButtonDataAction>{formatTime(meetingTime)}</ButtonDataAction>
            </div>
            <div className='flex gap-8'>
                <ButtonDataAction 
                    className={twMerge('rounded-full px-3 py-3', isShareScreen ? 'opacity-50' : 'hover:bg-primary-100')} 
                    onClick={handleShareScreen}
                >
                    <MonitorUp className='w-6 h-6'/>
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    <Brush className='w-6 h-6'/>
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    <MessageSquare className='w-6 h-6'/>
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    <TextSelect className='w-6 h-6'/>
                </ButtonDataAction>
            </div>
            <div className='flex gap-2'>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    {/* <Video className='w-6 h-6'/> */}
                    <VideoOff className='w-6 h-6'/>
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3'>
                    <Mic className='w-6 h-6'/>
                    {/* <MicOff className='w-6 h-6'/> */}
                </ButtonDataAction>
                <ButtonDataAction className='rounded-full px-3 py-3 bg-error-2 md:hover:bg-red-500' title="Leave">
                    <Phone className='w-6 h-6 stroke-white rotate-[135deg]'/>
                </ButtonDataAction>
            </div>
        </section>
    );
};
