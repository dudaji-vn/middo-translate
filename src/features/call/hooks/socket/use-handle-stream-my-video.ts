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
import processingStream from "../../utils/processing-stream";
import getUserStream from "../../utils/get-user-stream";
import { useTranslation } from "react-i18next";

export default function useHandleStreamMyVideo() {
    const { myStream, setMyStream, setShareScreenStream, setShareScreen, setTurnOnCamera, setTurnOnMic, setLoadingVideo } = useMyVideoCallStore();
    const { participants, clearPeerShareScreen, resetParticipants, setStreamForParticipant, updatePeerParticipant } = useParticipantVideoCallStore();
    const { clearStateVideoCall } = useVideoCallStore();
    const {t} = useTranslation('common');
    useEffect(() => {
        let myVideoStream: MediaStream | null = null;
        setLoadingVideo(true);
        // Start get streaming
        getUserStream({isTurnOnCamera: DEFAULT_USER_CALL_STATE.isTurnOnCamera, isTurnOnMic: DEFAULT_USER_CALL_STATE.isTurnOnMic})
        .then((stream: MediaStream) => {
            myVideoStream = stream;
            setMyStream(myVideoStream);
            setStreamForParticipant(myVideoStream, socket.id || '', false)
            setLoadingVideo(false);
        }).catch((err: any) =>  {
            setTurnOnCamera(false);
            setTurnOnMic(false);
            setLoadingVideo(false);
            console.log(err)
            toast.error(t('MESSAGE.ERROR.NO_ACCESS_MEDIA'));
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
    }, [clearPeerShareScreen, clearStateVideoCall, resetParticipants, setLoadingVideo, setMyStream, setShareScreen, setShareScreenStream, setStreamForParticipant, setTurnOnCamera, setTurnOnMic, t]);

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