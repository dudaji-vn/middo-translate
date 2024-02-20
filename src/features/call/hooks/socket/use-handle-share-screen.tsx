import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useVideoCallStore } from "../../store/video-call.store";
import toast from "react-hot-toast";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import { useCallback, useEffect } from "react";
import { createPeer } from "../../utils/peer-action.util";
import ParticipantInVideoCall from "../../interfaces/participant";
import { MonitorX } from "lucide-react";
import { VIDEOCALL_LAYOUTS } from "../../constant/layout";

export default function useHandleShareScreen() {
    const { room, setLayout, setChooseScreen } = useVideoCallStore();
    const { participants, removeParticipantShareScreen, peerShareScreen, clearPeerShareScreen, addParticipant, addPeerShareScreen } = useParticipantVideoCallStore();
    const { shareScreenStream, setShareScreen, isShareScreen, setShareScreenStream } = useMyVideoCallStore();
    const { user } = useAuthStore();

    const removeShareScreen = useCallback((socketId: string) => {
        const item = participants.find((p: ParticipantInVideoCall) => p.socketId === socketId && p.isShareScreen);
        if (item) {
            item.peer.destroy();
            removeParticipantShareScreen(socketId);
            toast.success(`${item.user.name} stopped sharing screen`, { icon: <MonitorX size={20} /> })
        }
        if(item?.pin) {
            setShareScreen(false);
            setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW);
        }
    }, [participants, removeParticipantShareScreen, setLayout, setShareScreen])

    const createPeerShareScreenConnection = useCallback((users: any[]) => {
        if (!shareScreenStream) return;
        users.forEach((u: { id: string; user: any }) => {
            if (!socket.id) return;
            const peer = createPeer();
            peer.on("signal", (signal) => {
                socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_SIGNAL, { id: u.id, user, callerId: socket.id, signal, isShareScreen: true })
            });
            peer.addStream(shareScreenStream);
            addPeerShareScreen({
                id: u.id,
                peer,
            });
        });
    }, [addPeerShareScreen, shareScreenStream, user])

    const sendShareScreenStream = useCallback((socketId: string) => {
        if (!shareScreenStream) return;
        if (!socket.id || socketId === socket.id) return;
        const peer = createPeer();
        peer.on("signal", (signal) => {
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_SIGNAL, { id: socketId, user, callerId: socket.id, signal, isShareScreen: true })
        });
        peer.addStream(shareScreenStream);
        addPeerShareScreen({
            id: socketId,
            peer,
        });
    }, [addPeerShareScreen, shareScreenStream, user])

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
            shareScreenStream.getTracks().forEach((track: any) => {
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
            shareScreenStream.getTracks().forEach((track: any) => {
                track.stop();
            });
        }
        setShareScreen(false);
        removeParticipantShareScreen(socket.id);
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
        socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN);
        socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN);
        peerShareScreen.forEach((peer: any) => {
            if (!peer.peer) return;
            peer.peer.destroy();
        });
        clearPeerShareScreen();
    },[clearPeerShareScreen, peerShareScreen, removeParticipantShareScreen, setShareScreen, shareScreenStream])

    const handleShareScreen = useCallback(async ()=>{
        // if (participants.some((participant) => participant.isShareScreen)) return;
        if (isShareScreen) {
            stopShareScreen();
            return;
        }
        const navigator = window.navigator as any;
        if (!navigator.mediaDevices.getDisplayMedia) {
            toast.error('Device not support share screen');
            return;
        }
        try {
            const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
            if(isElectron) {
                setChooseScreen(true);
                return;
            }

            let stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 15 }, audio: true })
            if (!socket.id) return;
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
              toast.error('Device not supported for sharing screen');
            }
        }

    }, [addParticipant, isShareScreen, room?._id, setShareScreen, setShareScreenStream, stopShareScreen, user])

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
    return {
        handleShareScreen,
        stopShareScreen
    }
}