import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useVideoCallStore } from "../../store/video-call.store";
import toast from "react-hot-toast";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import { useEffect } from "react";
import { createPeer } from "../../utils/peer-action.util";
import ParticipantInVideoCall from "../../interfaces/participant";
import { MonitorX } from "lucide-react";

export default function useHandleShareScreen() {
    const { room } = useVideoCallStore();
    const { participants, removeParticipantShareScreen, peerShareScreen, clearPeerShareScreen, addParticipant, addPeerShareScreen } = useParticipantVideoCallStore();
    const { shareScreenStream, setShareScreen, isShareScreen, setShareScreenStream } = useMyVideoCallStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (!shareScreenStream) return;
        let peersShareScreenTmp: any[] = [];
        // Receive list user in room
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN, (users: any[]) => {
            users.forEach((u: { id: string; user: any }) => {
                if (!socket.id) return;
                const peer = createPeer({
                    id: u.id,
                    socketId: socket.id,
                    user: user,
                    isShareScreen: true,
                });
                peer.addStream(shareScreenStream);
                peersShareScreenTmp.push(peer);
                addPeerShareScreen({
                    id: u.id,
                    peer,
                });
            });
        });
        socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN, (socketId: string) => {
            if (!socket.id || socketId === socket.id) return;
            const peer = createPeer({
                id: socketId,
                socketId: socket.id,
                user: user,
                isShareScreen: true,
            });
            peer.addStream(shareScreenStream);
            peersShareScreenTmp.push(peer);
            addPeerShareScreen({
                id: socketId,
                peer,
            });
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN);
            if (peersShareScreenTmp && peersShareScreenTmp.length > 0) {
                peersShareScreenTmp.forEach((peer: any) => {
                    if (!peer) return;
                    peer.destroy();
                });
            }
            if (!shareScreenStream) return;
            shareScreenStream.getTracks().forEach((track: any) => {
                track.stop();
            });
        };
    }, [addPeerShareScreen, shareScreenStream, user]);

    useEffect(() => {
        // Event when have someone stop share screen
        socket.on(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN, (socketId: string) => {
            const item = participants.find((p: ParticipantInVideoCall) => p.socketId === socketId && p.isShareScreen);
            if (item) {
                item.peer.destroy();
                removeParticipantShareScreen(socketId);
                toast.success(`${item.user.name} stopped sharing screen`, {icon: <MonitorX size={20}/>})
            }
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
        }
    }, [participants, removeParticipantShareScreen]);

    useEffect(()=>{
        // Emit event to request get share screen
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN, {
            roomId: room?._id,
            userId: socket.id,
        });
    }, [room?._id])

    const stopShareScreen = () => {
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
    };
    const handleShareScreen = () => {
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
        navigator.mediaDevices
            .getDisplayMedia({ video: true, audio: true })
            .then(async (stream: MediaStream) => {
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
                stream.getVideoTracks()[0].onended = () => {
                    if (!socket.id) return;
                    stopShareScreen();
                };
            })
            .catch((err: Error) => {
                if (err.name != 'NotAllowedError') {
                    toast.error('Device not support share screen');
                }
            });
    };
    return {
        handleShareScreen,
        stopShareScreen
    }
}