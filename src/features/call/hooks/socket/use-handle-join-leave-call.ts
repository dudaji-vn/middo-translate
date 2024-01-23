import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { IReturnSignal } from "../../interfaces/socket/signal.interface";
import ParticipantInVideoCall from "../../interfaces/participant";
import { useVideoCallStore } from "../../store/video-call.store";
import SpeechRecognition from "react-speech-recognition";

export default function useHandleJoinLeaveCall() {
    const { removeParticipant, participants, peerShareScreen, removePeerShareScreen, addUsersRequestJoinRoom, removeUsersRequestJoinRoom } = useParticipantVideoCallStore();
    const { room } = useVideoCallStore();

    useEffect(() => {
        // Event when have user leave room
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LEAVE, (socketId: string) => {
            const items = participants.filter((p: any) => p.socketId === socketId);
            if (items.length > 0) {
                items.forEach((item: any) => {
                    if (item.peer) {
                        item.peer.destroy();
                    }
                    removeParticipant(socketId);
                });
            }
            if (items[0]?.user?.name) {
                toast.success(`${items[0].user.name} left meeting`);
            }

            // Check have in share screen peer
            const itemShareScreen = peerShareScreen.find(
                (p: any) => p.id === socketId,
            );
            if (itemShareScreen) {
                itemShareScreen.peer.destroy();
                removePeerShareScreen(socketId);
            }
        });

        // Event when have user want to join room
        socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM, ({ user, socketId }: { user: any; socketId: string }) => {
            addUsersRequestJoinRoom({ socketId, user });
        });

        // Event when have another user response request join room
        socket.on(SOCKET_CONFIG.EVENTS.CALL.ANSWERED_JOIN_ROOM, (socketId: string) => {
            removeUsersRequestJoinRoom(socketId);
        });

        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LEAVE);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.ANSWERED_JOIN_ROOM);
        };
    }, [addUsersRequestJoinRoom, participants, peerShareScreen, removeParticipant, removePeerShareScreen, removeUsersRequestJoinRoom]);

    useEffect(() => {
        // Listen event return signal
        socket.on(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL, (payload: IReturnSignal) => {
            const itemInParticipant = participants.find((p: ParticipantInVideoCall) =>
                p.socketId === payload.id &&
                p.isShareScreen === payload.isShareScreen,
            );
            if (itemInParticipant) {
                itemInParticipant.peer.signal(payload.signal);
                return;
            }
            if (!peerShareScreen) return;
            const item = peerShareScreen.find((p: any) => p.id === payload.id);
            if (!item || !item.peer) return;
            item.peer.signal(payload.signal);
        });
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL);
        };
    }, [participants, peerShareScreen]);

    // Emit event leave room when component unmount
    useEffect(() => {
        return () => {
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.LEAVE, room._id);
            SpeechRecognition.stopListening();
        };
    }, [room._id]);
}