'use client';

import { MoreVertical, MonitorUp, Brush, TextSelect, MessageSquare, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import ButtonDataAction from '@/components/actions/button/button-data-action';

export interface VideoCallBottomProps { }

export const VideoCallBottom = ({ }: VideoCallBottomProps) => {
    return (
        <section className='p-1 flex justify-between border-b border-neutral-50 border-t'>
            <div className='w-[160px]'></div>
            <div className='flex gap-8'>
                <ButtonDataAction className='rounded-full px-3 py-3'>
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
