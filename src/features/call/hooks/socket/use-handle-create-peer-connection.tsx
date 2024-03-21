import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useCallback, useEffect } from "react";
import { useVideoCallStore } from "../../store/video-call.store";
import toast from "react-hot-toast";
import ParticipantInVideoCall from "../../interfaces/participant";
import { VIDEOCALL_LAYOUTS } from "../../constant/layout";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useMyVideoCallStore } from "../../store/me.store";
import { addPeer, createPeer } from "../../utils/peer-action.util";
import { IJoinCallPayload } from "../../interfaces/socket/join.interface";
import { MonitorUpIcon, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function useHandleCreatePeerConnection() {
    const { setDoodle, setDoodleImage, setLayout, isPinDoodle, setPinShareScreen } = useVideoCallStore();
    const { participants, addParticipant, updatePeerParticipant } = useParticipantVideoCallStore();
    const { myStream } = useMyVideoCallStore();
    const {t} = useTranslation('common')
    
    // SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT
    const createPeerUserConnection = useCallback(({ users, doodleImage }: {users: any[], doodleImage: string}) => {
        if(!socket.id) return;
        // Loop and create peer connection for each user
        users.forEach((user: { id: string; user: any }) => {
            if (user.id === socket.id) return;
            const peer = createPeer();
            if(myStream) {
                peer.addStream(myStream);
            }
            addParticipant({
                peer,
                user: user.user,
                socketId: user.id,
                isShareScreen: false,
            });
        });
        
        // Check have doodle
        if (doodleImage) {
            setDoodle(true);
            setDoodleImage(doodleImage);
        }

    },[addParticipant, myStream, setDoodle, setDoodleImage])

    // SOCKET_CONFIG.EVENTS.CALL.USER_JOINED
    const addPeerUserConnection = useCallback((payload: IJoinCallPayload) => {
        const peer = addPeer(payload.signal);
        if(myStream) {
            peer.addStream(myStream);
        }
        let oldParticipant = participants.find((p: ParticipantInVideoCall) =>
            p.socketId === payload.callerId &&
            p.isShareScreen === payload.isShareScreen,
        );
        if (oldParticipant) {
            // Update peer User
            oldParticipant.peer.destroy();
            updatePeerParticipant(peer, payload.callerId);
            return;
        }
        const newUser: ParticipantInVideoCall = {
            socketId: payload.callerId,
            peer,
            user: payload.user,
            isShareScreen: payload.isShareScreen,
            isElectron: payload?.isElectron || false,
        };
        if (payload.isShareScreen) {
            setLayout(VIDEOCALL_LAYOUTS.SHARE_SCREEN);
            const isHavePin = participants.some((p: ParticipantInVideoCall) => p.pin);
            if (!isHavePin && !isPinDoodle) {
                setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW);
                setPinShareScreen(true);
                newUser.pin = true;
            }
            toast.success(t('MESSAGE.SUCCESS.SHARE_SCREEN', {name: payload.user.name}), {icon: <MonitorUpIcon size={20}/>});
        } else {
            toast.success(t('MESSAGE.SUCCESS.JOIN_MEETING', {name: payload.user.name}), {icon: <LogIn size={20}/>});
        }
        addParticipant(newUser);
    },[addParticipant, isPinDoodle, myStream, participants, setLayout, setPinShareScreen, updatePeerParticipant, t])

    
    // useEffect when myStream change
    useEffect(() => {
        // Event receive list user
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT, createPeerUserConnection);
        // Event when have new user join room or someone share screen (isShareScreen = true)
        socket.on(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED, addPeerUserConnection);

        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED);
        };
    }, [addPeerUserConnection, createPeerUserConnection]);
}