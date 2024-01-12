import { Avatar } from "@/components/data-display";
import { memo, use, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useAudioLevel from "../../hooks/use-audio-level";
import { Mic, VideoOff } from "lucide-react";
import useLoadStream from "../../hooks/use-load-stream";
import trimLongName from "../../utils/trim-long-name.util";
import useFitRatio from "../../hooks/use-fit-ratio";
interface FocusVideoItemProps {
    participant?: any;
}
const FocusVideoItem = ({ participant}: FocusVideoItemProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const parentRef = useRef<HTMLElement>(null)
    const { streamVideo } = useLoadStream(participant, videoRef)
    // const { isTalk } = useAudioLevel(streamVideo)
    useFitRatio(videoRef, parentRef)
    return ( 
        <section ref={parentRef} className='rounded-xl overflow-hidden relative transition-all w-full h-full flex items-center justify-center bg-neutral-900'>
            <video ref={videoRef} className='rounded-sm w-full h-full object-contain' autoPlay muted playsInline controls={false}></video>
            <div className='absolute bottom-1 left-1 p-2 rounded-xl flex gap-2 bg-white/80 text-black items-center justify-center'>
                <span className='leading-none relative'>
                    {participant?.isMe ? "You" : (trimLongName(participant?.user?.name) || '')}
                    {participant?.isShareScreen ? "  (Screen)" : ""}
                </span>
            </div>
        </section>
    )
}
export default memo(FocusVideoItem)