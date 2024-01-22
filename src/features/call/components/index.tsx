'use client';


import { useEffect } from "react";
import ReceiveVideoCall from "./receive-call";
import VideoCallDragWrapper from "./video-call-drag-wrapper";
import socket from "@/lib/socket-io";
import { sendEvent } from "../utils/custom-event.util";
import { SOCKET_CONFIG } from "@/configs/socket";
import { useVideoCallStore } from "../store/video-call.store";

const CallVideoModalContainer = () => {
    const { removeRequestCall } = useVideoCallStore();
    useEffect(() => {
        socket.on(SOCKET_CONFIG.EVENTS.CALL.MEETING_END, (roomIdEnd: string) => {
            removeRequestCall(roomIdEnd);
            sendEvent('MEETING_END', roomIdEnd)
        });
        socket.on(SOCKET_CONFIG.EVENTS.CALL.START, (roomIdStart: string) => {
            sendEvent('MEETING_START', roomIdStart)
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.MEETING_END);
        }
    }, [removeRequestCall])
    return (
        <>
            <VideoCallDragWrapper />
            <ReceiveVideoCall />
        </>
    )
};

export default CallVideoModalContainer;