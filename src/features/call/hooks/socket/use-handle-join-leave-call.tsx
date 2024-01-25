import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { IReturnSignal } from "../../interfaces/socket/signal.interface";
import ParticipantInVideoCall from "../../interfaces/participant";
import { useVideoCallStore } from "../../store/video-call.store";
import SpeechRecognition from "react-speech-recognition";
import { LogOutIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import DEFAULT_USER_CALL_STATE from "../../constant/default-user-call-state";

export default function useHandleJoinLeaveCall() {
    const { removeParticipant, participants, peerShareScreen, removePeerShareScreen, addParticipant } = useParticipantVideoCallStore();
    const { room } = useVideoCallStore();
    const { myStream, setTurnOnCamera, setTurnOnMic } = useMyVideoCallStore();
    const { user } = useAuthStore();

    const removeUserLeavedRoom = useCallback((socketId: string) => {
        // use filter because when user share screen leave, need remove both user and share screen
        const items = participants.filter((p: any) => p.socketId === socketId);
        items.forEach((item: any) => {
            if (item.peer) item.peer.destroy()
            removeParticipant(socketId);
        });
        if (items[0]?.user?.name) {
            toast.success(`${items[0].user.name} left meeting`, { icon: <LogOutIcon size={20} /> });
        }

        // Remove peer share screen
        const itemShareScreen = peerShareScreen.find(
            (p: any) => p.id === socketId,
        );
        if (itemShareScreen) {
            itemShareScreen.peer.destroy();
            removePeerShareScreen(socketId);
        }
    }, [participants, peerShareScreen, removeParticipant, removePeerShareScreen])

    const saveSignal = useCallback((payload: IReturnSignal) => {
        const participant = participants.find((p: ParticipantInVideoCall) =>
            p.socketId === payload.id &&
            p.isShareScreen === payload.isShareScreen,
        );
        if (participant) {
            participant.peer.signal(payload.signal);
            return;
        }
        if (!peerShareScreen) return;
        const item = peerShareScreen.find((p: any) => p.id === payload.id);
        if (!item || !item.peer) return;
        item.peer.signal(payload.signal);
    }, [participants, peerShareScreen])

    useEffect(() => {
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LEAVE, removeUserLeavedRoom);
        socket.on(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL, saveSignal);

        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LEAVE);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL);
        };
    }, [removeUserLeavedRoom, saveSignal]);

    useEffect(() => {
        // Emit event join room when component mount
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, {
            callId: room?._id,
            user,
            roomId: room.roomId,
        });
        // Emit event leave room when component unmount
        return () => {
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.LEAVE, room._id);
            SpeechRecognition.stopListening();
            setTurnOnCamera(DEFAULT_USER_CALL_STATE.isTurnOnCamera)
            setTurnOnMic(DEFAULT_USER_CALL_STATE.isTurnOnMic)
        };
    }, [addParticipant, room._id, room.roomId, setTurnOnCamera, setTurnOnMic, user]);


    // Add Me To list participant
    useEffect(() => {
        const isHaveMe = participants.some((p: ParticipantInVideoCall) => p.isMe);
        if (!isHaveMe) {
            const me: ParticipantInVideoCall = { user, isMe: true, socketId: socket.id || '' }
            if (myStream) {
                me.stream = myStream
            }
            addParticipant(me);
        };
    }, [addParticipant, myStream, participants, user]);

}