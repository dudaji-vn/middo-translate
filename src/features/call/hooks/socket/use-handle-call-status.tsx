import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { useMyVideoCallStore } from "../../store/me.store";
import { useVideoCallStore } from "../../store/video-call.store";
import { useParticipantVideoCallStore } from "../../store/participant.store";
interface ICallStatus {
    userId: string;
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
            userId: user?._id,
            status: isTurnOnMic,
            roomId: call._id
        });
    }, [isTurnOnMic, call, user?._id])


    // Listen to Mic change
    useEffect(() => {
        if(!call) return;
        socket.on(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE, (data: ICallStatus) => {
            const { userId, status, callId } = data;
            if(callId !== call._id) return;
            changeMicStatusParticipant(userId, status);
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE);
        }
    }, [changeMicStatusParticipant, call])

}