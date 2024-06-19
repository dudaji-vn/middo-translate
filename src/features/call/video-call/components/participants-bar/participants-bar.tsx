import { useParticipantVideoCallStore } from "@/features/call/store/participant.store";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import DoodleItem from "../doodle/doodle-item";
import ParticipantInVideoCall from "@/features/call/interfaces/participant";
import VideoItem from "../video/video-item";
import { DoodleArea } from "../doodle/doodle-area";
import FocusVideoItem from "../video/focus-video-item";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { motion, useAnimationControls, useDragControls } from 'framer-motion';

import { cn } from "@/utils/cn";
import { Button } from "@/components/actions";
import { GripVerticalIcon, Maximize2Icon, MenuIcon, Minimize2Icon } from "lucide-react";
import { useBoolean } from "usehooks-ts";
import { Avatar } from "@/components/data-display";

interface ParticipantsBarProps {
    participants: ParticipantInVideoCall[];
}
const ParticipantsBar = ({ participants }: ParticipantsBarProps) => {
    const {value: isExpanded, toggle: toggleExpanded} = useBoolean(true);
    return (
        <DragBar isExpanded={isExpanded} toggleExpanded={toggleExpanded}>
            <div className={cn("flex flex-col gap-1", !isExpanded && 'hidden' )}>
                {
                    participants.map((participant: ParticipantInVideoCall) => {
                        return (
                            <div key={participant.socketId + participant.isShareScreen} className="w-full aspect-video bg-neutral-50 rounded-xl overflow-hidden">
                                <VideoItem participant={participant} />
                            </div>
                        )
                    })
                }
            </div>

            { !isExpanded && 
                participants.map((participant: ParticipantInVideoCall) => {
                    return (
                        <div key={participant.socketId + participant.isShareScreen} className="p-1 h-[52px] aspect-square">
                            <Avatar
                                className="h-full w-full bg-neutral-900 object-cover"
                                src={participant?.user?.avatar || '/avatar_default.png'}
                                alt={participant?.user?.name || 'Anonymous'}
                            />
                        </div>
                    )
                })
            }
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
    const dragButtonRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!headerRef) return;

        headerRef.current?.addEventListener('mouseenter', enableDrag);
        headerRef.current?.addEventListener('mouseleave', disableDrag);
        dragButtonRef.current?.addEventListener('mouseenter', enableDrag);
        dragButtonRef.current?.addEventListener('mouseleave', disableDrag);
        return () => {
          headerRef.current?.removeEventListener('mouseenter', enableDrag);
          headerRef.current?.removeEventListener('mouseleave', disableDrag);
          dragButtonRef.current?.removeEventListener('mouseenter', enableDrag);
          dragButtonRef.current?.removeEventListener('mouseleave', disableDrag);
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
                className={cn("pointer-events-auto absolute h-fit cursor-auto shadow-glow top-4 right-4  rounded-2xl p-1 bg-white dark:bg-background flex gap-1 flex-col", 
                isExpanded ? 'w-[168px]' : 'w-fit flex-row-reverse items-center')}
            >
                <div className="flex-1 flex justify-end cursor-grab active:cursor-grabbing" ref={headerRef}>
                    <Button.Icon
                        variant={"ghost"}
                        size={'sm'}
                        color={'default'}
                        onClick={toggleExpanded}
                    >
                        { isExpanded ? <Minimize2Icon /> : <Maximize2Icon /> }
                    </Button.Icon>
                </div>
                {children}
                <div className={cn("h-full p-1 rounded-md bg-neutral-50 cursor-grab active:cursor-grabbing", isExpanded && "hidden")} ref={dragButtonRef}>
                    <GripVerticalIcon />
                </div>
            </motion.div>
        </motion.div>
    );
}