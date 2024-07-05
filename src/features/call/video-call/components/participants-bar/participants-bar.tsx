import ParticipantInVideoCall from "@/features/call/interfaces/participant";
import VideoItem from "../video/video-item";
import { PropsWithChildren, useEffect, useRef } from "react";
import { motion, useAnimationControls, useDragControls } from 'framer-motion';

import { cn } from "@/utils/cn";
import { Button } from "@/components/actions";
import { Maximize2Icon, Minimize2Icon, PhoneForwardedIcon, ScreenShare, ScreenShareIcon } from "lucide-react";
import { useBoolean } from "usehooks-ts";
import { Avatar } from "@/components/data-display";
import { useParticipantVideoCallStore } from "@/features/call/store/participant.store";
import { useBusinessNavigationData } from "@/hooks";
import { useVideoCallStore } from "@/features/call/store/video-call.store";

interface ParticipantsBarProps {
    participants: ParticipantInVideoCall[];
}
const ParticipantsBar = ({ participants }: ParticipantsBarProps) => {
    const {value: isExpanded, toggle: toggleExpanded} = useBoolean(true);
    const pinParticipant = useParticipantVideoCallStore(state => state.pinParticipant);
    const {isBusiness} = useBusinessNavigationData()
    const pin = (socketId: string, isShareScreen: boolean) => {
        pinParticipant(socketId, isShareScreen || false);
    }
    const setModal = useVideoCallStore(state => state.setModal)
    return (
        <DragBar isExpanded={isExpanded} toggleExpanded={toggleExpanded}>
            <div className={cn("flex flex-col gap-1", !isExpanded && 'hidden' )}>
                {
                    participants.map((participant: ParticipantInVideoCall) => {
                        return (
                            <div key={participant.socketId + participant.isShareScreen} className="w-full aspect-video bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden">
                                <VideoItem participant={participant} />
                            </div>
                        )
                    })
                }
            </div>

            <div className={cn("flex justify-center w-full gap-1", isExpanded && 'hidden' )}>
                {
                    participants.map((participant: ParticipantInVideoCall) => {
                        return (
                            <div key={participant.socketId + participant.isShareScreen} className="relative h-12 w-12 cursor-pointer hover:opacity-90 transition-all active:opacity-80" onClick={()=>{
                                pin(participant.socketId, participant.isShareScreen || false);
                            }}>
                                <Avatar
                                    className="h-full w-full bg-neutral-900 object-cover"
                                    src={participant?.user?.avatar || '/avatar_default.svg'}
                                    alt={participant?.user?.name || 'Anonymous'}
                                />
                                {participant.isShareScreen && 
                                <div className="absolute bottom-0 right-0 bg-neutral-100 dark:bg-neutral-900 dark:border-background border-2 dark:text-neutral-50 border-white rounded-full p-1">
                                    <ScreenShareIcon size={12}/>
                                </div>}
                            </div>
                        )
                    })
                }
            </div>

            {isBusiness && 
            <Button
                size="sm"
                shape={'square'}
                variant={'default'}
                color={"secondary"}
                className="w-full whitespace-nowrap"
                startIcon={<PhoneForwardedIcon />}
                onClick={()=>setModal('forward-call')}
            >
                Forward Call
            </Button>}
        </DragBar>
    );
};

export default ParticipantsBar;

interface DragBarProps {
    isExpanded: boolean;
    toggleExpanded: () => void;
}
const DragBar = ({isExpanded, toggleExpanded, children}: DragBarProps & PropsWithChildren) => {
    const constraintsRef = useRef<HTMLDivElement>(null);
    const dragContainerRef = useRef<HTMLDivElement>(null);
    const controls = useDragControls();
    const animationControls = useAnimationControls();
    const {value: isAllowDrag, setTrue: enableDrag, setFalse: disableDrag} = useBoolean(true);
    const headerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!headerRef) return;
        headerRef.current?.addEventListener('mouseenter', enableDrag);
        headerRef.current?.addEventListener('mouseleave', disableDrag);
        return () => {
          headerRef.current?.removeEventListener('mouseenter', enableDrag);
          headerRef.current?.removeEventListener('mouseleave', disableDrag);
        };
      }, []);

    return (
        <motion.div
            ref={constraintsRef}
            className={cn("pointer-events-none absolute inset-0 z-10 block cursor-auto bg-transparent")}
        >
            <motion.div
                drag
                dragConstraints={constraintsRef}
                dragControls={controls}
                dragMomentum={false}
                animate={animationControls}
                dragListener={isAllowDrag}  
                ref={dragContainerRef}
                className={cn("pointer-events-auto absolute h-fit cursor-auto shadow-glow top-4 right-4  rounded-2xl bg-white dark:bg-background overflow-hidden", 
                isExpanded ? 'w-[168px]' : 'min-w-16')}
            >
                <div className="cursor-grab active:cursor-grabbing bg-neutral-50 dark:bg-neutral-900 p-1" ref={headerRef}>
                    <Button.Icon
                        variant={"ghost"}
                        size={'ss'}
                        color={'default'}
                        onClick={toggleExpanded}
                        className="ml-auto block"
                    >
                        { isExpanded ? <Minimize2Icon /> : <Maximize2Icon /> }
                    </Button.Icon>
                </div>
                <div className="p-1 flex flex-col gap-1">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}