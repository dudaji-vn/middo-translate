import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useEffect } from "react";
import { useVideoCallStore } from "../../store/video-call.store";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import DEFAULT_USER_CALL_STATE from "../../constant/default-user-call-state";
import getStreamConfig from "../../utils/get-stream-config";

export default function useHandleStreamMyVideo() {
    const { user } = useAuthStore();
    const { setShareScreen, setMyStream, setShareScreenStream } = useMyVideoCallStore();
    const { clearPeerShareScreen, resetParticipants, resetUsersRequestJoinRoom } = useParticipantVideoCallStore();
    const { room, clearStateVideoCall } = useVideoCallStore();
    useEffect(() => {
        let myVideoStream: MediaStream | null = null;
        if (!DEFAULT_USER_CALL_STATE.isTurnOnCamera && !DEFAULT_USER_CALL_STATE.isTurnOnMic) return;
        const navigator = window.navigator as any;
        const streamConfig = getStreamConfig(DEFAULT_USER_CALL_STATE.isTurnOnCamera, DEFAULT_USER_CALL_STATE.isTurnOnMic)
        navigator.mediaDevices.getUserMedia({
            ...streamConfig
        }).then((stream: MediaStream) => {
            myVideoStream = stream;
            setMyStream(stream);
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, {
                callId: room?._id,
                user,
                roomId: room.roomId,
            });
        }).catch((err: any) => {
            console.log('Error stream my video', err)
        })
        return () => {
            if (myVideoStream) {
                myVideoStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            clearStateVideoCall();
            clearPeerShareScreen();
            setShareScreen(false);
            setShareScreenStream(undefined);
            setMyStream(undefined);
            resetParticipants();
            resetUsersRequestJoinRoom();
        };
    }, [clearPeerShareScreen, clearStateVideoCall, resetParticipants, resetUsersRequestJoinRoom, room?._id, room.roomId, setMyStream, setShareScreen, setShareScreenStream, user]);


}