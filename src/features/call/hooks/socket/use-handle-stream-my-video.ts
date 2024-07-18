import socket from "@/lib/socket-io";
import { useEffect } from "react";
import { useVideoCallStore } from "../../store/video-call.store";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import DEFAULT_USER_CALL_STATE from "../../constant/default-user-call-state";
import toast from "react-hot-toast";
import ParticipantInVideoCall from "../../interfaces/participant";
import { createPeer } from "../../utils/peer-action.util";
import getUserStream from "../../utils/get-user-stream";
import { useTranslation } from "react-i18next";
import { SOCKET_CONFIG } from "@/configs/socket";
import { useVideoSettingStore } from "../../store/video-setting.store";
import customToast from "@/utils/custom-toast";

export default function useHandleStreamMyVideo() {
    const {t} = useTranslation('common');

    const myStream = useMyVideoCallStore(state => state.myStream);
    const setMyStream = useMyVideoCallStore(state => state.setMyStream);
    const setShareScreenStream = useMyVideoCallStore(state => state.setShareScreenStream);
    const setShareScreen = useMyVideoCallStore(state => state.setShareScreen);
    const setTurnOnCamera = useMyVideoCallStore(state => state.setTurnOnCamera);
    const isTurnOnCamera = useMyVideoCallStore(state => state.isTurnOnCamera);
    const setTurnOnMic = useMyVideoCallStore(state => state.setTurnOnMic);
    const isTurnOnMic =  useMyVideoCallStore(state => state.isTurnOnMic);
    const setLoadingVideo = useMyVideoCallStore(state => state.setLoadingVideo);
    const participants = useParticipantVideoCallStore(state => state.participants);
    const clearPeerShareScreen = useParticipantVideoCallStore(state => state.clearPeerShareScreen);
    const resetParticipants = useParticipantVideoCallStore(state => state.resetParticipants);
    const setStreamForParticipant = useParticipantVideoCallStore(state => state.setStreamForParticipant);
    const updatePeerParticipant = useParticipantVideoCallStore(state => state.updatePeerParticipant);
    const user = useAuthStore(state => state.user);
    const clearStateVideoCall = useVideoCallStore(state => state.clearStateVideoCall);
    const room = useVideoCallStore(state => state.room);
    const video = useVideoSettingStore(state => state.video);
    const audio = useVideoSettingStore(state => state.audio);
    const setLoadingStream = useMyVideoCallStore(state => state.setLoadingStream);
    useEffect(() => {
        let myVideoStream: MediaStream = new MediaStream();
        setLoadingVideo(true);
        setLoadingStream(true);
        // Start get streaming
        getUserStream({isTurnOnCamera: isTurnOnCamera, isTurnOnMic: isTurnOnMic, cameraDeviceId: video?.deviceId || undefined, micDeviceId: audio?.deviceId || undefined})
        .then((stream: MediaStream) => {
            myVideoStream = stream;
        }).catch(_ =>  {
            setTurnOnCamera(false);
            setTurnOnMic(false);
            customToast.error(t('MESSAGE.ERROR.NO_ACCESS_MEDIA'));
        }).finally(() => {
            setMyStream(myVideoStream);
            setStreamForParticipant(myVideoStream, socket.id || '', false)
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, {
                callId: room?._id,
                user,
                roomId: room?.roomId,
            });
        });

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
            setTurnOnCamera(DEFAULT_USER_CALL_STATE.isTurnOnCamera);
            setTurnOnMic(DEFAULT_USER_CALL_STATE.isTurnOnMic);
        };
    // Remove t from dependencies => language change will not trigger this function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clearPeerShareScreen, clearStateVideoCall, resetParticipants, room?._id, room?.roomId, setLoadingVideo, setMyStream, setShareScreen, setShareScreenStream, setStreamForParticipant, setTurnOnCamera, setTurnOnMic, user?._id]);

    // Add my stream to all participants
    useEffect(()=>{
        if(!myStream) return;
        participants.forEach((p: ParticipantInVideoCall) => {
            if(!p.peer || p.isShareScreen) return;
            // console.log('Add my stream to all participants===============================')
            p.peer.destroy();
            const newPeer = createPeer(myStream);
            updatePeerParticipant(newPeer, p.socketId)
            // p.peer.addStream(myStream);
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