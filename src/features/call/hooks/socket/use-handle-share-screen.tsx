import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useVideoCallStore } from "../../store/video-call.store";
import toast from "react-hot-toast";
import { IPeerShareScreen, useParticipantVideoCallStore } from "../../store/participant.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import { useCallback, useEffect } from "react";
import { createPeer } from "../../utils/peer-action.util";
import ParticipantInVideoCall from "../../interfaces/participant";
import { MonitorX } from "lucide-react";
import { VIDEO_CALL_LAYOUTS } from "../../constant/layout";
import { useElectron } from "@/hooks/use-electron";
import { ELECTRON_EVENTS } from "@/configs/electron-events";
import { useTranslation } from "react-i18next";
import { User } from "@/features/users/types";
import customToast from "@/utils/custom-toast";

export default function useHandleShareScreen() {
    const {t} = useTranslation('common');

    const room = useVideoCallStore(state => state.room);
    const setLayout = useVideoCallStore(state => state.setLayout);
    const setChooseScreen = useVideoCallStore(state => state.setChooseScreen);
    const participants = useParticipantVideoCallStore(state => state.participants);
    const removeParticipantShareScreen = useParticipantVideoCallStore(state => state.removeParticipantShareScreen);
    const peerShareScreen = useParticipantVideoCallStore(state => state.peerShareScreen);
    const clearPeerShareScreen = useParticipantVideoCallStore(state => state.clearPeerShareScreen);
    const addParticipant = useParticipantVideoCallStore(state => state.addParticipant);
    const addPeerShareScreen = useParticipantVideoCallStore(state => state.addPeerShareScreen);
    const shareScreenStream = useMyVideoCallStore(state => state.shareScreenStream);
    const setShareScreen = useMyVideoCallStore(state => state.setShareScreen);
    const isShareScreen = useMyVideoCallStore(state => state.isShareScreen);
    const setShareScreenStream = useMyVideoCallStore(state => state.setShareScreenStream);
    const user = useAuthStore(state => state.user);

    const {isElectron, ipcRenderer} = useElectron();
    
    const removeShareScreen = useCallback((socketId: string) => {
        const item = participants.find((p: ParticipantInVideoCall) => p.socketId === socketId && p.isShareScreen);
        if (item) {
            item.peer?.destroy();
            removeParticipantShareScreen(socketId);
            customToast.success(t('MESSAGE.SUCCESS.STOP_SHARE_SCREEN', {name: item?.user?.name}), { icon: <MonitorX size={20} /> })
        }
        if(item?.pin) {
            setShareScreen(false);
            setLayout(VIDEO_CALL_LAYOUTS.GALLERY_VIEW);
        }
    }, [participants, removeParticipantShareScreen, setLayout, setShareScreen, t])

    const createPeerShareScreenConnection = useCallback((users: { id: string; user: User }[]) => {
        if (!shareScreenStream) return;
        users.forEach((u: { id: string; user: User }) => {
            if (!socket.id) return;
            const peer = createPeer(shareScreenStream);
            peer.on("signal", (signal) => {
                socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_SIGNAL, { id: u.id, user, callerId: socket.id, signal, isShareScreen: true, isElectron: isElectron })
            });
            addPeerShareScreen({
                id: u.id,
                peer,
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addPeerShareScreen, shareScreenStream, user?._id, isElectron])

    const sendShareScreenStream = useCallback((socketId: string) => {
        if (!shareScreenStream) return;
        if (!socket.id || socketId === socket.id) return;
        const peer = createPeer(shareScreenStream);
        peer.on("signal", (signal) => {
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_SIGNAL, { id: socketId, user, callerId: socket.id, signal, isShareScreen: true, isElectron: isElectron })
        });
        addPeerShareScreen({
            id: socketId,
            peer,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addPeerShareScreen, shareScreenStream, user?._id, isElectron])

    useEffect(() => {
        if (!shareScreenStream) return;
        // Receive list user in room
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN, createPeerShareScreenConnection);
        // Have someone in room want to get share screen stream
        socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN, sendShareScreenStream);
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN);
            if (!shareScreenStream) return;
            shareScreenStream.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
            });
        };
    }, [createPeerShareScreenConnection, sendShareScreenStream, shareScreenStream]);

    useEffect(() => {
        // Event when have someone stop share screen
        socket.on(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN, removeShareScreen);
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
        }
    }, [removeShareScreen]);

    useEffect(() => {
        // Emit event to request get share screen
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN, room?._id);
    }, [room?._id])

    const stopShareScreen = useCallback(() => {
        if (!socket.id) return;
        if (shareScreenStream) {
            shareScreenStream.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
            });
        }
        const isPinMyStream = participants.some((p) => p.isShareScreen && p.pin && p.isMe);
        if(isPinMyStream) {
            setLayout(VIDEO_CALL_LAYOUTS.GALLERY_VIEW);
        }
        setShareScreen(false);
        removeParticipantShareScreen(socket.id);
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
        socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN);
        socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN);
        peerShareScreen.forEach((peer: IPeerShareScreen) => {
            if (!peer.peer) return;
            peer.peer.destroy();
        });
        clearPeerShareScreen();
        if(isElectron && ipcRenderer) {
            ipcRenderer.send(ELECTRON_EVENTS.STOP_SHARE_SCREEN);
        }
    },[clearPeerShareScreen, ipcRenderer, isElectron, participants, peerShareScreen, removeParticipantShareScreen, setLayout, setShareScreen, shareScreenStream])

    const handleShareScreen = useCallback(async ()=>{
        // if (participants.some((participant) => participant.isShareScreen)) return;
        if (isShareScreen) {
            stopShareScreen();
            return;
        }
        const navigator: Navigator = window.navigator as Navigator
        if(isElectron) {
            setChooseScreen(true);
            ipcRenderer.send(ELECTRON_EVENTS.GET_SCREEN_SOURCE);
            return;
        }
        if (!navigator.mediaDevices.getDisplayMedia) {
            customToast.error(t('MESSAGE.ERROR.DEVICE_NOT_SUPPORTED'));
            return;
        }
        try {
            let stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 15 }, audio: true })
            if (!socket.id || !user) return;
            const shareScreen = {
                stream,
                user: user,
                isMe: true,
                isShareScreen: true,
                socketId: socket.id,
            };
            addParticipant(shareScreen);
            setShareScreen(true);
            setShareScreenStream(stream);
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, room?._id);
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== 'NotAllowedError') {
                customToast.error(t('MESSAGE.ERROR.DEVICE_NOT_SUPPORTED'));
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addParticipant, isShareScreen, room?._id, setChooseScreen, setShareScreen, setShareScreenStream, stopShareScreen, user?._id, isElectron])

    useEffect(() => {
        if(!shareScreenStream) return;
        const handleEnd = () => {
            if (!socket.id) return;
            stopShareScreen();
        }
        // shareScreenStream.getVideoTracks()[0].onended = () => {
        //     if (!socket.id) return;
        //     stopShareScreen();
        // };
        shareScreenStream.addEventListener('inactive', handleEnd)
        shareScreenStream.getVideoTracks()[0].addEventListener('ended', handleEnd)
        return () => {
            if(handleEnd) {
                shareScreenStream.removeEventListener('inactive', handleEnd)
                shareScreenStream.getVideoTracks()[0].removeEventListener('ended', handleEnd)
            }
        }
    }, [shareScreenStream, stopShareScreen])

    useEffect(() => {
        if(!isElectron || !ipcRenderer) return;
        ipcRenderer.on(ELECTRON_EVENTS.STOP_SHARE, stopShareScreen);

        return () => {
            if(!isElectron || !ipcRenderer) return;
            ipcRenderer.off(ELECTRON_EVENTS.STOP_SHARE, stopShareScreen);
        }
      }, [ipcRenderer, isElectron, stopShareScreen])

    return {
        handleShareScreen,
        stopShareScreen
    }
}