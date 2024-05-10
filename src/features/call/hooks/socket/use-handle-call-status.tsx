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
    roomId: string;
}
export default function useHandleCallStatus() {
    const user = useAuthStore((state) => state.user);
    const isTurnOnMic = useMyVideoCallStore((state) => state.isTurnOnMic);
    const room = useVideoCallStore((state) => state.room);
    const changeMicStatusParticipant = useParticipantVideoCallStore((state) => state.changeMicStatusParticipant);
    const participants = useParticipantVideoCallStore((state) => state.participants);

    // Send Mic Status change
    useEffect(() => {
        if(!room) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE, {
            userId: user?._id,
            status: isTurnOnMic,
            roomId: room._id
        });
    }, [isTurnOnMic, room, user?._id, participants?.length])


    // Listen to Mic change
    useEffect(() => {
        if(!room) return;
        socket.on(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE, (data: ICallStatus) => {
            const { userId, status, roomId } = data;
            if(roomId !== room._id) return;
            changeMicStatusParticipant(userId, status);
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE);
        }
    }, [changeMicStatusParticipant, room])

}