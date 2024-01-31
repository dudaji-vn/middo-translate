'use client';

import { Button } from "@/components/actions";
import { motion, useDragControls } from "framer-motion"
import { Phone, PhoneOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useVideoCallStore } from "../store/video-call.store";
import { Avatar } from "@/components/data-display";
import socket from "@/lib/socket-io";
import { SOCKET_CONFIG } from "@/configs/socket";
import { useAuthStore } from "@/stores/auth.store";
import { useAppStore } from "@/stores/app.store";

const ReceiveVideoCall = () => {
    const constraintsRef = useRef<HTMLDivElement>(null)
    const controls = useDragControls()
    const { requestCall, removeRequestCall, addRequestCall, setRoom } = useVideoCallStore();
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const { user: me } = useAuthStore();
    const isMobile = useAppStore((state) => state.isMobile);

    const declineCall = () => {
        removeRequestCall();
    }
    const acceptCall = () => {
        removeRequestCall();
        setRoom(requestCall[0]?.call);
    }
    useEffect(() => {
        setAudio(new Audio('/mp3/ringing.mp3'))
    }, [])

    useEffect(() => {
        socket.on(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, ({ call, user }) => {
            if (user._id == me?._id) return;
            const isHave = requestCall.find((item) => item.id == call.roomId);
            if (isHave) return;
            addRequestCall({ id: call.roomId, call, user });
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL);
        }
    }, [addRequestCall, me?._id, removeRequestCall, requestCall])

    useEffect(() => {
        if (!audio) return;
        if (requestCall.length > 0) {
            // const isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended
            //     && audio.readyState > audio.HAVE_CURRENT_DATA;
            // if (!isPlaying) {
                audio.currentTime = 0;
                audio.play();
                audio.addEventListener('ended', () => {
                    audio.play();
                });
            // }
        } else {
            if (audio.paused) return;
            audio.pause();
        }
    }, [audio, requestCall])

    return (
        <motion.div
            ref={constraintsRef}
            className={`fixed inset-0 z-[51] max-h-dvh bg-transparent pointer-events-none cursor-auto block ${requestCall.length > 0 ? 'block' : 'hidden'}`}
        >
            <motion.div
                drag
                dragConstraints={constraintsRef}
                dragControls={controls}
                dragMomentum={false}
                className={`pointer-events-auto cursor-auto absolute w-full h-full md:h-[252px]  md:rounded-xl md:w-[336px] md:bottom-4 md:left-4 shadow-glow`}
            >
                <div className="md:rounded-xl overflow-hidden md:border md:border-primary-400 bg-white flex flex-col h-full w-full max-h-dvh">
                    <div className="py-2 pr-1 pl-3 flex items-center text-primary gap-1 bg-primary-100 md:cursor-grab md:active:cursor-grabbing">
                        <Phone className="h-4 w-4 stroke-current" />
                        <span className="flex-1 font-semibold truncate">{requestCall[0]?.call?.name}</span>
                        <Button.Icon
                            variant='default'
                            color='default'
                            size='xs'
                            onClick={declineCall}
                        >
                            <X />
                        </Button.Icon>
                    </div>
                    <div className="relative flex flex-col flex-1 overflow-hidden">
                        <div className="h-full relative p-3 flex justify-center flex-col flex-1 overflow-hidden">
                            <div className="flex gap-2 items-center justify-center">
                                <Avatar
                                    size="lg"
                                    src={requestCall[0]?.call?.avatar || requestCall[0]?.user?.avatar || '/person.svg'}
                                    alt="avatar"
                                />
                                {requestCall[0]?.room?.participants?.length > 2 && <p className="truncate">{requestCall[0]?.call?.name}</p>}
                            </div>
                            <p className="text-center mt-3"><strong>{requestCall[0]?.user?.name}</strong> is calling</p>
                        </div>
                        <div className="p-3 flex justify-around gap-2 pb-20 md:pb-3">
                            <Button
                                onClick={declineCall}
                                size={isMobile ? "md" : 'xs'}
                                color="error"
                                shape={isMobile ? "default" : "square"}
                                variant="default"
                                startIcon={<PhoneOff className="m-0 md:mr-1"/>}
                                className="md:flex-1 p-5 md:px-3 md:py-2"
                            >
                                <span className="md:inline-block hidden">Decline</span>
                            </Button>
                            <Button
                                onClick={acceptCall}
                                size={isMobile ? "md" : 'xs'}
                                color="success"
                                shape={isMobile ? "default" : "square"}
                                variant="default"
                                startIcon={<Phone className="m-0 md:mr-1"/>}
                                className="md:flex-1 p-5 md:px-3 md:py-2"
                            >
                                <span className="md:inline-block hidden">Accept</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
};

export default ReceiveVideoCall;