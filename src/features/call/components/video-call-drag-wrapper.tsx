'use client';

import { Button } from "@/components/actions";
import { motion, useDragControls } from "framer-motion"
import { Maximize2, Minimize2, Phone } from "lucide-react";
import { useRef } from "react";
import { useVideoCallStore } from "../store/video-call.store";
import VideoCallPage from "./video-call-main";

const VideoCallDragWrapper = () => {
    const constraintsRef = useRef<HTMLDivElement>(null)
    const controls = useDragControls()
    const { room, isFullScreen, setFullScreen } = useVideoCallStore();

    const toggleFullScreen = () => {
        setFullScreen(!isFullScreen);
    }

    return (
        <motion.div
            ref={constraintsRef}
            className={`fixed inset-0 z-50 max-h-dvh bg-transparent pointer-events-none cursor-auto ${room ? 'block' : 'hidden'}`}
        >
            <motion.div
                drag
                dragListener={!isFullScreen}
                dragConstraints={constraintsRef}
                dragControls={controls}
                dragMomentum={false}
                className={`pointer-events-auto cursor-auto absolute ${isFullScreen ? 'w-full h-full !translate-y-0 !translate-x-0' : 'w-[336px] bottom-4 left-4 rounded-xl overflow-hidden border border-primary-400'}`}
            >
                <div className=" bg-white flex flex-col h-full w-full shadow-2 shadow-primary-500/30 max-h-dvh">
                    <div className={`py-2 pr-1 pl-3 flex items-center text-primary gap-1 bg-neutral-50 ${!isFullScreen && 'cursor-grab active:cursor-grabbing'}`}>
                        <Phone className="h-4 w-4 stroke-current" />
                        <span className="flex-1 font-semibold">{room?.name}</span>
                        <Button.Icon
                            variant='default'
                            color='default'
                            size='sm'
                            onClick={toggleFullScreen}
                        >
                            {isFullScreen ? <Minimize2 /> : <Maximize2 />}
                        </Button.Icon>

                    </div>
                    <div className="relative h-[calc(100%-60px)]">
                        <div className="h-full relative">
                        <VideoCallPage></VideoCallPage>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
};

export default VideoCallDragWrapper;