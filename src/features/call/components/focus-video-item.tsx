import { Avatar } from "@/components/data-display";
import { memo, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useAudioLevel from "../hooks/useAudioLevel";
import { Mic, VideoOff } from "lucide-react";
import useLoadStream from "../hooks/useLoadStream";
import trimLongName from "../utils/trimLongName";
interface FocusVideoItemProps {
    participant?: any;
}
const FocusVideoItem = ({ participant}: FocusVideoItemProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const { streamVideo } = useLoadStream(participant, videoRef)
    const { isTalk } = useAudioLevel(streamVideo)
    useEffect(() => {
        const handleCheckRatioVideo = () => {
            if(!videoRef.current) return;
            const videoWidth = videoRef.current.videoWidth
            const videoHeight = videoRef.current.videoHeight
            if(window.innerWidth / window.innerHeight > videoWidth / videoHeight) {
                videoRef.current.style.width = '100%'
                videoRef.current.style.height = 'auto'
            } else if (window.innerWidth / window.innerHeight < videoWidth / videoHeight) {
                videoRef.current.style.width = 'auto'
                videoRef.current.style.height = '100%'
            } else {
                videoRef.current.style.width = '100%'
                videoRef.current.style.height = '100%'
            }
            
        }
        window.addEventListener('resize', handleCheckRatioVideo)
        handleCheckRatioVideo()
        return () => {
            window.removeEventListener('resize', handleCheckRatioVideo)
        }
    }, [videoRef])
    return ( 
        <section className='rounded-xl overflow-hidden relative transition-all w-full h-full flex items-center justify-center bg-neutral-900'>
            <video ref={videoRef} className='rounded-xl' autoPlay muted playsInline controls={false}></video>
            {/* <div className='absolute bottom-4 right-1/2 translate-x-1/2 p-2 rounded-xl flex gap-2 bg-white/80 text-black items-center justify-center'>
                <span className='leading-none relative'>{trimLongName(participant?.user?.name) + " Screen" || ""}</span>
            </div> */}
        </section>
    )
}
export default memo(FocusVideoItem)