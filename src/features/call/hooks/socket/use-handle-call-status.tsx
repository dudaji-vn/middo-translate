import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { useMyVideoCallStore } from "../../store/me.store";
import { useVideoCallStore } from "../../store/video-call.store";
import { useParticipantVideoCallStore } from "../../store/participant.store";
interface ICallStatus {
    socketId: string;
    status: boolean;
    callId: string;
}
export default function useHandleCallStatus() {
    const user = useAuthStore((state) => state.user);
    const isTurnOnMic = useMyVideoCallStore((state) => state.isTurnOnMic);
    const call = useVideoCallStore((state) => state.call);
    const changeMicStatusParticipant = useParticipantVideoCallStore((state) => state.changeMicStatusParticipant);

    // Send Mic Status change
    useEffect(() => {
        if(!call) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE, {
            status: isTurnOnMic,
            callId: call._id
        });
    }, [isTurnOnMic, call])


    // Listen to Mic change
    useEffect(() => {
        if(!call) return;
        socket.on(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE, (data: ICallStatus) => {
            const { socketId, status, callId } = data;
            if(callId !== call._id) return;
            changeMicStatusParticipant(socketId, status);
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE);
        }
    }, [changeMicStatusParticipant, call])

}