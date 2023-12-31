"use client";

import { Avatar } from '@/components/data-display'
import { Mic, VideoOff } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

export default function VideoCallContent({ participants }: { participants: any[] }) {

    return (
        <main className='p-1 w-full h-full flex flex-col'>
            {/* <ScrollMenu 
                LeftArrow={null} 
                RightArrow={null}
                itemClassName='min-h-[96px]'
            >
                {new Array(numberUser).fill(0).map((_, index) => <VideoItem key={index} size='small'/>)}
            </ScrollMenu> */}
            <div className='grid gap-1 grid-cols-2'>
                {participants.map((participant, index) => <VideoItem key={index} participant={participant} />)}
            </div>
        </main>
    )
}

interface VideoItemProps {
    size?: 'small' | 'normal';
    participant?: any;
}
const VideoItem = ({ size = 'normal', participant }: VideoItemProps) => {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [isTalk, setIsTalk] = React.useState(false)

    useEffect(() => {
        if (!participant || !videoRef.current) return
        videoRef.current.srcObject = participant.stream
        videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current?.play();
        })
        
    }, [participant, videoRef])
    
    useEffect(() => {
        var audioContext = new AudioContext();
        var mediaStreamSource = audioContext.createMediaStreamSource(participant.stream);
        var processor = audioContext.createScriptProcessor(2048, 1, 1);
        mediaStreamSource.connect(audioContext.destination);
        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination);
        processor.onaudioprocess = function (e) {
            var inputData = e.inputBuffer.getChannelData(0);
            var inputDataLength = inputData.length;
            var total = 0;

            for (var i = 0; i < inputDataLength; i++) {
                total += Math.abs(inputData[i++]);
            }
            var rms = Math.sqrt(total / inputDataLength);
            if(rms > 0.1 && !isTalk) setIsTalk(true)
            else if(rms < 0.1 && isTalk) setIsTalk(false)
        };
    }, [isTalk, participant])

    return (
        <section className={twMerge('rounded-xl overflow-hidden w-full h-full relative min-h-[112px] min-w-[20vw] transition-all')}>
            <div className={twMerge('absolute inset-0 border-4 border-primary rounded-xl transition-all', isTalk ? 'opacity-100' : 'opacity-0')}></div>
            {!participant && <div className={twMerge('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96px] max aspect-square',
                size == 'small' ? 'w-[48px]' : ''
            )}>
                <Avatar
                    className='w-full h-full'
                    src='/person.svg'
                    alt='avatar'
                />
            </div>}
            {/* <div className='w-full h-full bg-neutral-900 rounded-xl'></div> */}
            <video ref={videoRef} className='w-full h-full object-cover rounded-xl' autoPlay muted></video>
            <div className='absolute bottom-4 left-4 p-2 rounded-full flex gap-2 bg-black/80 text-white items-center justify-center'>
                <span className='leading-none relative'>{participant?.user?.name || ""}</span>
                <span className='w-[1px] h-5 bg-neutral-800'></span>
                <VideoOff className='w-5 h-5 stroke-error-2'></VideoOff>
                <Mic className='w-5 h-5 stroke-neutral-500'></Mic>
            </div>
        </section>
    )
}