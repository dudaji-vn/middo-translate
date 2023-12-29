"use client";

import { Avatar } from '@/components/data-display'
import { Mic, VideoOff } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

export default function VideoCallContent({participants}: {participants: any[]}) {
    const generateClass = (numberUser: number) => {
        switch (numberUser) {
            case 1:
                return 'w-full h-full'
            case 2:
                return 'w-full h-full flex'
            case 3:
            case 4:
                return 'w-full h-full grid grid-cols-2 grid-rows-2'
            default:
                return 'w-full h-full grid grid-cols-2 grid-rows-2'
        }

    }
    
    return (
        <main className='p-1 w-full h-full flex flex-col'>
            {/* <ScrollMenu 
                LeftArrow={null} 
                RightArrow={null}
                itemClassName='min-h-[96px]'
            >
                {new Array(numberUser).fill(0).map((_, index) => <VideoItem key={index} size='small'/>)}
            </ScrollMenu> */}
            <div className={generateClass(participants.length)}>
                {participants.map((participant, index) => <VideoItem key={index} participant={participant}/>)}
            </div>
        </main>
    )
}

interface VideoItemProps {  
    size?: 'small' | 'normal';
    participant?: any;
}
const VideoItem = ( { size = 'normal', participant } : VideoItemProps) => {
    let isTalk = Math.random() > 0.8
    const videoRef = React.useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!participant || !videoRef.current) return
        const video = document.createElement('video');
        video.className = 'w-full h-full object-cover'
        video.srcObject = participant.stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        })
        videoRef.current.append(video)
    }, [participant, participant.stream, videoRef])
    return (
        <section className={twMerge('rounded-[20px] overflow-hidden w-full h-full relative p-1 min-h-[112px] min-w-[20vw]', isTalk ? 'border-4 border-primary' : '')}>
            {!participant && <div className={twMerge('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96px] max aspect-square',
                size == 'small' ? 'w-[48px]' : ''
            )}>
                <Avatar
                    className='w-full h-full'
                    src='/person.svg'
                    alt='avatar'
                />
            </div>}
            {/* <div className='w-full h-full bg-neutral-900 rounded-2xl'></div> */}
            <div ref={videoRef} className='w-full h-full object-cover overflow-hidden rounded-xl'></div>
            {/* <video ref={videoRef} className='w-full h-full object-cover' autoPlay muted></video> */}
            <div className='absolute bottom-4 left-4 p-2 rounded-full flex gap-2 bg-black/80 text-white items-center justify-center'>
                <span className='leading-none relative top-[-3px]'>Jay</span>
                <span className='w-[1px] h-5 bg-neutral-800'></span>
                <VideoOff className='w-5 h-5 stroke-error-2'></VideoOff>
                <Mic className='w-5 h-5 stroke-neutral-500'></Mic>
            </div>
        </section>
    )
}