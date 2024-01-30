import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useEffect } from "react";
import { useVideoCallStore } from "../../store/video-call.store";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import DEFAULT_USER_CALL_STATE from "../../constant/default-user-call-state";
import getStreamConfig from "../../utils/get-stream-config";
import toast from "react-hot-toast";
import ParticipantInVideoCall from "../../interfaces/participant";
import { createPeer } from "../../utils/peer-action.util";

export default function useHandleStreamMyVideo() {
    const { user } = useAuthStore();
    const { myStream, setMyStream, setShareScreenStream, setShareScreen, setTurnOnCamera, setTurnOnMic } = useMyVideoCallStore();
    const { participants, clearPeerShareScreen, resetParticipants, setStreamForParticipant, updatePeerParticipant } = useParticipantVideoCallStore();
    const { room: call, clearStateVideoCall } = useVideoCallStore();
    useEffect(() => {
        let myVideoStream: MediaStream | null = null;
        // Can not start stream if user turn off both camera and mic
        if (!DEFAULT_USER_CALL_STATE.isTurnOnCamera && !DEFAULT_USER_CALL_STATE.isTurnOnMic) return;
        const navigator = window.navigator as any;
        const streamConfig = getStreamConfig(DEFAULT_USER_CALL_STATE.isTurnOnCamera, DEFAULT_USER_CALL_STATE.isTurnOnMic)

        // Start get streaming
        navigator.mediaDevices.getUserMedia({...streamConfig}).then((stream: MediaStream) => {
            myVideoStream = stream;
            setMyStream(stream);
            setStreamForParticipant(stream, socket.id || '', false)
        }).catch((err: any) =>  {
            setTurnOnCamera(false);
            setTurnOnMic(false);
            toast.error("Can not access to your camera and mic!")
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
        };
    }, [clearPeerShareScreen, clearStateVideoCall, resetParticipants, call._id, call.roomId, setMyStream, setShareScreen, setShareScreenStream, user, setStreamForParticipant, setTurnOnCamera, setTurnOnMic]);

    // Add my stream to all participants
    useEffect(()=>{
        if(!myStream) return;
        participants.forEach((p: ParticipantInVideoCall) => {
            if(!p.peer || p.isShareScreen) return;
            p.peer.destroy();
            const newPeer = createPeer();
            if(myStream) {
                newPeer.addStream(myStream);
            }
            updatePeerParticipant(newPeer, p.socketId)
        })
        return () => {
            if(!myStream) return;
            myStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myStream])

}