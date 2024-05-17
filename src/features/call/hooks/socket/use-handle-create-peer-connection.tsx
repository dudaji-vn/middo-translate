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
    const {t} = useTranslation('common')

    const setDoodle = useVideoCallStore(state => state.setDoodle);
    const setDoodleImage = useVideoCallStore(state => state.setDoodleImage);
    const setLayout = useVideoCallStore(state => state.setLayout);
    const isPinDoodle = useVideoCallStore(state => state.isPinDoodle);
    const setPinShareScreen = useVideoCallStore(state => state.setPinShareScreen);

    const participants = useParticipantVideoCallStore(state => state.participants);
    const addParticipant = useParticipantVideoCallStore(state => state.addParticipant);
    const updatePeerParticipant = useParticipantVideoCallStore(state => state.updatePeerParticipant);
    const updateParticipant = useParticipantVideoCallStore(state => state.updateParticipant);
    const myStream = useMyVideoCallStore(state => state.myStream);

    const setLoadingVideo = useMyVideoCallStore(state => state.setLoadingVideo);
    const setLoadingStream = useMyVideoCallStore(state => state.setLoadingStream);
    
    // SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT
    const createPeerUserConnection = useCallback(({ users, doodleImage }: {users: any[], doodleImage: string}) => {
        if(!socket.id) return;
        if(users.length === 0) {
            setLoadingVideo(false);
            setLoadingStream(false);
        }
        // Loop and create peer connection for each user
        users.forEach((user: { id: string; user: any }) => {
            if (user.id === socket.id) return;
            const peer = createPeer(myStream);
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

    },[addParticipant, myStream, setDoodle, setDoodleImage, setLoadingStream, setLoadingVideo])

    // SOCKET_CONFIG.EVENTS.CALL.USER_JOINED
    const addPeerUserConnection = useCallback((payload: IJoinCallPayload) => {
        const peer = addPeer();
        peer.signal(payload.signal);
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
        if (!payload.isShareScreen) {
            newUser.isTurnOnMic = payload.isTurnOnMic;
        }

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
        // Check is user is waiting for join
        let isInParticipantList = participants.some((p: ParticipantInVideoCall) => (p.user._id === payload.user._id && !!p.isShareScreen == !!payload.isShareScreen));
        if(isInParticipantList) {
            updateParticipant(newUser, payload.user._id);
        } else {
            addParticipant(newUser);
        }
    // Remove t from dependencies => language change will not trigger this function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[myStream, participants, addParticipant, updatePeerParticipant, updateParticipant, setLayout, isPinDoodle, setPinShareScreen])

    
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