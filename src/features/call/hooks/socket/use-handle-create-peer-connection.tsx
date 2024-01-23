import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useEffect } from "react";
import { useVideoCallStore } from "../../store/video-call.store";
import toast from "react-hot-toast";
import ParticipantInVideoCall from "../../interfaces/participant";
import { VIDEOCALL_LAYOUTS } from "../../constant/layout";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMyVideoCallStore } from "../../store/me.store";
import { addPeer, createPeer } from "../../utils/peer-action.util";
import { IJoinCallPayload } from "../../interfaces/socket/join.interface";
import { MonitorUpIcon, LogIn } from "lucide-react";

export default function useHandleCreatePeerConnection() {
    const { setDoodle, setDoodleImage, setLayout, room } = useVideoCallStore();
    const { participants, addParticipant, updatePeerParticipant } = useParticipantVideoCallStore();
    const { myStream } = useMyVideoCallStore();
    const { user: myInfo } = useAuthStore();

    // useEffect when myStream change
    useEffect(() => {
        if (!socket.id) return;
        if (!myStream) return;
        const me = { stream: myStream, user: myInfo, isMe: true, socketId: socket.id };
        // Event receive list user
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT, ({ users, doodleImage }) => {
            // Loop and create peer connection for each user
            console.log('Receive list user', users)
            users.forEach((user: { id: string; user: any }) => {
                if (user.id === socket.id) return;
                const peer = createPeer({
                    id: user.id,
                    socketId: socket.id || '',
                    user: myInfo,
                });
                peer.addStream(myStream);
                addParticipant({
                    peer,
                    user: user.user,
                    socketId: user.id,
                    isShareScreen: false,
                });
            });
            addParticipant(me);
            if (doodleImage) {
                setDoodle(true);
                setDoodleImage(doodleImage);
            }
        },
        );
        // Event when have new user join room or someone share screen (isShareScreen = true)
        socket.on(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED, (payload: IJoinCallPayload) => {
            const peer = addPeer({
                signal: payload.signal,
                callerId: payload.callerId,
                user: myInfo,
                isShareScreen: payload.isShareScreen,
            });
            peer.addStream(myStream);
            let oldParticipant = participants.find((p: ParticipantInVideoCall) =>
                p.socketId === payload.callerId &&
                p.isShareScreen === payload.isShareScreen,
            );
            if (oldParticipant) {
                // Update peer User
                oldParticipant?.peer.removeAllListeners('close');
                updatePeerParticipant(peer, payload.callerId);
                return;
            }
            const newUser = {
                socketId: payload.callerId,
                peer,
                user: payload.user,
                isShareScreen: payload.isShareScreen,
            };
            if (payload.isShareScreen) {
                setLayout(VIDEOCALL_LAYOUTS.SHARE_SCREEN);
                toast.success(`${payload.user.name} is sharing screen`, {icon: <MonitorUpIcon size={20}/>});
            } else {
                toast.success(`${payload.user.name} joined meeting`, {icon: <LogIn size={20}/>});
            }
            addParticipant(newUser);
        },
        );
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED);
        };
    }, [addParticipant, myStream, participants, room?._id, setDoodle, setDoodleImage, setLayout, updatePeerParticipant, myInfo]);
}