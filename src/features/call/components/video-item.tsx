import { Avatar } from "@/components/data-display";
import { memo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useAudioLevel from "../hooks/useAudioLevel";
import { Mic, VideoOff } from "lucide-react";
import useLoadStream from "../hooks/useLoadStream";
interface VideoItemProps {
    participant?: any;
    size?: 'sm' | 'md' | 'lg';
}
const VideoItem = ({ participant, size = 'md' }: VideoItemProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const { streamVideo } = useLoadStream(participant, videoRef)
    const { isTalk } = useAudioLevel(streamVideo)
    const classForSize = {
        sm: 'w-[240px]',
        md: '',
        lg: 'h-[480px]'
    }
    return (
        <section className={twMerge('rounded-xl overflow-hidden relative transition-all w-full h-full flex items-center justify-center bg-neutral-900', classForSize[size])}>
            <div className={twMerge('absolute inset-0 border-4 border-primary rounded-xl transition-all', isTalk ? 'opacity-100' : 'opacity-0')}></div>
            {/* {!participant && <div className={twMerge('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96px] max aspect-square')}>
                <Avatar
                    className='w-full h-full'
                    src='/person.svg'
                    alt='avatar'
                />
            </div>} */}
            {/* <div className='w-full h-full bg-neutral-900 rounded-xl'></div> */}
            <video ref={videoRef} className='w-full aspect-video flex-1 object-cover rounded-xl' autoPlay muted playsInline controls={false}></video>
            <div className='absolute bottom-4 left-4 p-2 rounded-full flex gap-2 bg-black/80 text-white items-center justify-center'>
                <span className='leading-none relative'>{participant?.user?.name || ""} {participant?.isShareScreen ? 'Screen' : ''}</span>
                <span className='w-[1px] h-5 bg-neutral-800'></span>
                <VideoOff className='w-5 h-5 stroke-error-2'></VideoOff>
                <Mic className='w-5 h-5 stroke-neutral-500'></Mic>
            </div>
        </section>
    )
}
export default memo(VideoItem)