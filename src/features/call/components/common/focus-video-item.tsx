import { memo, useEffect, useRef } from "react";
import { Maximize } from "lucide-react";
import useLoadStream from "../../hooks/use-load-stream";
import trimLongName from "../../utils/trim-long-name.util";
import useFitRatio from "../../hooks/use-fit-ratio";
interface FocusVideoItemProps {
    participant?: any;
}
const FocusVideoItem = ({ participant }: FocusVideoItemProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const parentRef = useRef<HTMLElement>(null)
    const { streamVideo } = useLoadStream(participant, videoRef)
    // const { isTalk } = useAudioLevel(streamVideo)

    useFitRatio(videoRef, parentRef)

    const fullScreenVideo = () => {
        if (!videoRef.current) return
        // Check is full screen video
        if (document.fullscreenElement) {
            document.exitFullscreen()
            return
        }
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen()
        }
    }

    // Disable pause video when fullscreen
    useEffect(() => {
        if (!videoRef.current) return
        let videoRefTmp = videoRef.current
        const handleDisablePauseVideo = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            videoRefTmp.play()
        }

        videoRefTmp.addEventListener('pause', handleDisablePauseVideo)
        return () => {
            if (!videoRefTmp) return
            videoRefTmp.removeEventListener('pause', handleDisablePauseVideo)
        }
    }, [streamVideo])
    return (
        <section ref={parentRef} className='rounded-xl overflow-hidden relative transition-all w-full h-full flex items-center justify-center bg-neutral-900'>
            <video ref={videoRef} className='relative w-full h-full object-contain' autoPlay muted playsInline controls={false} ></video>
            {/* Overlay black gradient from bottom to top */}
            <div className="absolute bottom-0 left-0 right-0 top-1/2 bg-gradient-to-t md:hover:from-black/70 transition-all md:flex hidden justify-end items-end p-3">
                <Maximize className="w-5 h-5 stroke-white cursor-pointer" onClick={fullScreenVideo} />
            </div>
            <div className='absolute bottom-1 left-1 p-2 rounded-xl flex gap-2 bg-black/80 text-white items-center justify-center'>
                <span className='leading-none relative'>
                    {participant?.isMe ? "You" : (trimLongName(participant?.user?.name) || '')}
                    {participant?.isShareScreen ? "  (Screen)" : ""}
                </span>
            </div>
        </section>
    )
}
export default memo(FocusVideoItem)