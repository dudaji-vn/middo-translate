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

const ReceiveVideoCall = () => {
    const constraintsRef = useRef<HTMLDivElement>(null)
    const controls = useDragControls()
    const { requestCall, removeRequestCall, addRequestCall, setRoom } = useVideoCallStore();
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const { user: me } = useAuthStore();
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
            className={`fixed inset-0 z-50 max-h-dvh bg-transparent pointer-events-none cursor-auto block ${requestCall.length > 0 ? 'block' : 'hidden'}`}
        >
            <motion.div
                drag
                dragConstraints={constraintsRef}
                dragControls={controls}
                dragMomentum={false}
                className={`pointer-events-auto cursor-auto absolute w-full h-full md:h-fit min-h-[252px] md:w-[336px] md:bottom-4 md:left-4 shadow-lg shadow-primary/500`}
            >
                <div className="rounded-xl overflow-hidden border border-primary-400 bg-white flex flex-col h-full w-full shadow-2 shadow-primary-500/30 max-h-dvh">
                    <div className={`py-2 pr-1 pl-3 flex items-center text-primary gap-1 bg-primary-100 md:cursor-grab md:active:cursor-grabbing`}>
                        <Phone className="h-4 w-4 stroke-current" />
                        <span className="flex-1 font-semibold">{requestCall[0]?.call?.name}</span>
                        <Button.Icon
                            variant='default'
                            color='default'
                            size='sm'
                            onClick={declineCall}
                        >
                            <X />
                        </Button.Icon>
                    </div>
                    <div className="relative flex flex-col h-[calc(100%-60px)]">
                        <div className="h-full relative p-3">
                            <div className="flex gap-2 items-center justify-center">
                                <Avatar
                                    size="lg"
                                    src={requestCall[0]?.call?.avatar || requestCall[0]?.user?.avatar || '/person.svg'}
                                    alt="avatar"
                                />
                                {requestCall[0]?.room?.participants?.length > 2 && <p>{requestCall[0]?.call?.name}</p>}
                            </div>
                            <p className="text-center mt-3"><strong>{requestCall[0]?.user?.name}</strong> is calling</p>
                        </div>
                        <div className="p-3 flex gap-2">
                            <Button
                                onClick={declineCall}
                                size="xs"
                                color="error"
                                variant="default"
                                startIcon={<PhoneOff />}
                                className="flex-1"
                            >
                                Decline
                            </Button>
                            <Button
                                onClick={acceptCall}
                                size="xs"
                                color="success"
                                variant="default"
                                startIcon={<Phone />}
                                className="flex-1"
                            >
                                Accept
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
};

export default ReceiveVideoCall;