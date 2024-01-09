import { Avatar } from "@/components/data-display";
import { memo, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useAudioLevel from "../hooks/use-audio-level";
import { Mic, VideoOff } from "lucide-react";
import useLoadStream from "../hooks/use-load-stream";
import trimLongName from "../utils/trim-long-name.util";
import useFitRatio from "../hooks/use-fit-ratio";
interface FocusVideoItemProps {
    participant?: any;
}
const FocusVideoItem = ({ participant}: FocusVideoItemProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const { streamVideo } = useLoadStream(participant, videoRef)
    // const { isTalk } = useAudioLevel(streamVideo)
    // useFitRatio(videoRef)
    return ( 
        <section className='rounded-xl overflow-hidden relative transition-all w-full h-full flex items-center justify-center bg-neutral-900'>
            <video ref={videoRef} className='rounded-xl w-full h-full object-contain' autoPlay muted playsInline controls={false}></video>
            <div className='absolute bottom-4 right-1/2 translate-x-1/2 p-2 rounded-xl flex gap-2 bg-white/80 text-black items-center justify-center'>
                <span className='leading-none relative'>{trimLongName(participant?.user?.name) + " Screen" || ""}</span>
            </div>
        </section>
    )
}
export default memo(FocusVideoItem)