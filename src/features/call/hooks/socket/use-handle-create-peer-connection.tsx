import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useCallback, useEffect } from "react";
import { useVideoCallStore } from "../../store/video-call.store";
import ParticipantInVideoCall, { StatusParticipant } from "../../interfaces/participant";
import { VIDEO_CALL_LAYOUTS } from "../../constant/layout";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useMyVideoCallStore } from "../../store/me.store";
import { addPeer, createPeer } from "../../utils/peer-action.util";
import { IJoinCallPayload } from "../../interfaces/socket/join.interface";
import { MonitorUpIcon, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { User } from "@/features/users/types";
import customToast from "@/utils/custom-toast";
import { useBusinessNavigationData } from "@/hooks/use-business-navigation-data";
import { useHelpDeskCallContext } from "@/features/help-desk/context/help-desk-call.context";
import { useAuthStore } from "@/stores/auth.store";

export default function useHandleCreatePeerConnection() {
    const {t} = useTranslation('common')

    const user = useAuthStore(state => state.user);
    const setDoodle = useVideoCallStore(state => state.setDoodle);
    const setDoodleImage = useVideoCallStore(state => state.setDoodleImage);
    const setLayout = useVideoCallStore(state => state.setLayout);
    const isPinDoodle = useVideoCallStore(state => state.isPinDoodle);
    const setPinShareScreen = useVideoCallStore(state => state.setPinShareScreen);
    const isTurnOnMic = useMyVideoCallStore(state => state.isTurnOnMic);
    const call = useVideoCallStore(state => state.call);
    const participants = useParticipantVideoCallStore(state => state.participants);
    const addParticipant = useParticipantVideoCallStore(state => state.addParticipant);
    const updatePeerParticipant = useParticipantVideoCallStore(state => state.updatePeerParticipant);
    const updateParticipant = useParticipantVideoCallStore(state => state.updateParticipant);
    const myStream = useMyVideoCallStore(state => state.myStream);
    const layout = useVideoCallStore(state => state.layout);
    
    const setLoadingVideo = useMyVideoCallStore(state => state.setLoadingVideo);
    const setLoadingStream = useMyVideoCallStore(state => state.setLoadingStream);

    const { isHelpDesk } = useBusinessNavigationData();
    const {businessData} = useHelpDeskCallContext();

    // SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT
    const createPeerUsersConnection = useCallback(({ users, doodleImage }: {users: { socketId: string; user: User }[], doodleImage: string}) => {
        if(!socket.id) return;
        if(users.length === 0) {
            setLoadingVideo(false);
            setLoadingStream(false);
        }
        // Loop and create peer connection for each user
        users.forEach((user: { socketId: string; user: User }) => {
            if (user.socketId === socket.id) return;
            const peer = createPeer(myStream);
            addParticipant({
                peer,
                user: user.user,
                socketId: user.socketId,
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
            oldParticipant.peer?.destroy();
            updatePeerParticipant(peer, payload.callerId);
            return;
        }
        const name = isHelpDesk ? (businessData?.space?.name || '') : payload.user.name
        const newUser: ParticipantInVideoCall = {
            socketId: payload.callerId,
            peer,
            user: {
                ...payload.user,
                name,
                avatar: isHelpDesk ? (businessData?.space?.avatar || '') : payload.user.avatar,
            },
            isShareScreen: payload.isShareScreen,
            isElectron: payload?.isElectron || false,
            status: StatusParticipant.JOINED,
        };
        if (!payload.isShareScreen) {
            newUser.isTurnOnMic = payload.isTurnOnMic;
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.CALL_STATUS.MIC_CHANGE, {
                status: isTurnOnMic,
                callId: call?._id,
                directUserId: payload.user._id,
            });
        }

        if (payload.isShareScreen) {
            const isHavePin = participants.some((p: ParticipantInVideoCall) => p.pin);
            if(!isHavePin) {
                newUser.pin = true;
                if (!isPinDoodle && layout == VIDEO_CALL_LAYOUTS.GALLERY_VIEW ) {
                    setLayout(VIDEO_CALL_LAYOUTS.FOCUS_VIEW);
                    setPinShareScreen(true);
                }
            }
            
            customToast.default(t('MESSAGE.SUCCESS.SHARE_SCREEN', {name}), {icon: <MonitorUpIcon size={20}/>});
        } else {
            customToast.default(t('MESSAGE.SUCCESS.JOIN_MEETING', {name}), {icon: <LogIn size={20}/>});
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
    },[myStream, participants, addParticipant, updatePeerParticipant, updateParticipant, setLayout, isPinDoodle, setPinShareScreen, user?._id, isTurnOnMic, call?._id])

    
    // useEffect when myStream change
    useEffect(() => {
        // Event receive list user
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT, createPeerUsersConnection);
        // Event when have new user join room or someone share screen (isShareScreen = true)
        socket.on(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED, addPeerUserConnection);

        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED);
        };
    }, [addPeerUserConnection, createPeerUsersConnection]);
}