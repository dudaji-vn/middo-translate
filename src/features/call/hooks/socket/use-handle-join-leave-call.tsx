import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { IPeerShareScreen, useParticipantVideoCallStore } from "../../store/participant.store";
import { IReturnSignal } from "../../interfaces/socket/signal.interface";
import ParticipantInVideoCall, { StatusParticipant } from "../../interfaces/participant";
import { useVideoCallStore } from "../../store/video-call.store";
import { LogOutIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import { useTranslation } from "react-i18next";
import { VIDEO_CALL_LAYOUTS } from "../../constant/layout";
import { User } from "@/features/users/types";
import customToast from "@/utils/custom-toast";

export default function useHandleJoinLeaveCall() {
    const {t} = useTranslation('common');

    const removeParticipant = useParticipantVideoCallStore(state => state.removeParticipant);
    const participants = useParticipantVideoCallStore(state => state.participants);
    const peerShareScreen = useParticipantVideoCallStore(state => state.peerShareScreen);
    const removePeerShareScreen = useParticipantVideoCallStore(state => state.removePeerShareScreen);
    const addParticipant = useParticipantVideoCallStore(state => state.addParticipant);
    const room = useVideoCallStore(state => state.room);
    const setLayout = useVideoCallStore(state => state.setLayout);
    const myStream = useMyVideoCallStore(state => state.myStream);
    const user = useAuthStore(state => state.user);

    const removeUserLeavedRoom = useCallback((socketId: string) => {
        if(socketId === socket.id) return;
        // use filter because when user share screen leave, need remove both user and share screen
        const items = participants.filter((p: ParticipantInVideoCall) => p.socketId === socketId);
        items.forEach((item: ParticipantInVideoCall) => {
            if (item.peer) item.peer.destroy()
            removeParticipant(socketId);
        });
        if (items[0]?.user?.name) {
            customToast.default(t('MESSAGE.SUCCESS.LEFT_MEETING', {name: items[0].user.name}), { icon: <LogOutIcon size={20} /> });
        }

        // Check have pin this user
        const isHavePin = items.some((p: ParticipantInVideoCall) => p.pin);
        if (isHavePin) {
            setLayout(VIDEO_CALL_LAYOUTS.GALLERY_VIEW);
        }
        // Remove peer share screen
        const itemShareScreen = peerShareScreen.find(
            (p: IPeerShareScreen) => p.id === socketId,
        );
        if (itemShareScreen) {
            itemShareScreen.peer.destroy();
            removePeerShareScreen(socketId);
        }
    // Remove t from dependencies => language change will not trigger this function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [participants, peerShareScreen, removeParticipant, removePeerShareScreen, setLayout])

    const saveSignal = useCallback((payload: IReturnSignal) => {
        const participant = participants.find((p: ParticipantInVideoCall) =>
            p.socketId === payload.id &&
            p.isShareScreen === payload.isShareScreen,
        );
        if (participant) {
            participant.peer?.signal(payload.signal);
            return;
        }
        if (!peerShareScreen) return;
        const item = peerShareScreen.find((p: IPeerShareScreen) => p.id === payload.id);
        if (!item || !item.peer) return;
        item.peer.signal(payload.signal);
    }, [participants, peerShareScreen])


    const addWaitingUser = useCallback((payload: {
        users: User[]
    }) => {
        payload.users.forEach((user: User) => {
            if(!participants.some((p: ParticipantInVideoCall) => p.user._id === user._id)) {
                addParticipant({ user, socketId: user._id, status: 'WAITING' });
            }
        })
    }, [addParticipant, participants])

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
        // socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, {
        //     callId: room?._id,
        //     user,
        //     roomId: room.roomId,
        // });

        return () => {
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.LEAVE);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room?._id, room?.roomId, user?._id]);

    // Add user waiting for join
    useEffect(() => {
        if(!socket.id) return;
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_WAITING_CALL, addWaitingUser);
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_WAITING_CALL, addWaitingUser);
        }
    }, [addWaitingUser, participants]);

    // // Add Me To list participant
    useEffect(() => {
        const isHaveMe = participants.some((p: ParticipantInVideoCall) => p.isMe);
        if(!user) return;
        if (!isHaveMe) {
            const me: ParticipantInVideoCall = { user, isMe: true, socketId: socket.id || '' }
            if (myStream) {
                me.stream = myStream
            }
            addParticipant(me);
        };
    }, [addParticipant, myStream, participants, user]);

    // // // Add Me To list participant
    // useEffect(() => {
    //     const isHaveMe = participants.some((p: ParticipantInVideoCall) => p.isMe);
    //     if(!user) return;
    //     if (!isHaveMe) {
    //         console.log('🟣 Add MEE')
    //         const me: ParticipantInVideoCall = { user, isMe: true, socketId: socket.id || '' }
    //         if (myStream) {
    //             me.stream = myStream
    //         }
    //         addParticipant(me);
    //     };
    // }, [addParticipant, myStream, participants, user]);

    // For testing layout
    // useEffect(() => {
    //     if(!user) return;
    //     const me: ParticipantInVideoCall = { user, isMe: true, socketId: socket.id || '' }
    //     if (myStream) {
    //         me.stream = myStream
    //     }
    //     let timer: NodeJS.Timeout = setTimeout(() => {
    //         // addParticipant(me);
    //     }, 2000)
    //     return () => {
    //         clearTimeout(timer);
    //     }
    // }, [addParticipant, myStream, participants, user]);

}