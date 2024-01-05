import { ConfirmStopDoodle } from './../components/common/ModalStopDoodle';
import { create } from 'zustand';
import {VIDEOCALL_LAYOUTS} from '../constant/layout';
import getRandomColor from '../utils/getRandomColor';

export interface ParicipantInVideoCall {
    peer?: any;
    user?: any;
    isMe?: boolean;
    stream?: MediaStream;
    isShareScreen?: boolean;
    socketId: string;
}
export type VideoCallState = {
    participants: ParicipantInVideoCall[];
    isShareScreen: boolean;
    isTurnOnCamera: boolean;
    isMute: boolean;
    room: any;
    layout: string;
    confirmLeave: boolean;
    usersRequestJoinRoom: any[];
    isDoodle: boolean;
    isDrawing: boolean;
    doodleImage: string | null;
    isMeDoole: boolean;
    confirmStopDoodle: boolean;
    colorDoodle: string;
    updateParticipant: (participants: ParicipantInVideoCall[]) => void;
    addParticipant: (participant: ParicipantInVideoCall) => void;
    setStreamForParticipant: (stream: MediaStream, socketId: string, isShareScreen: boolean) => void;
    removeParticipant: (socketId: string) => void;
    setShareScreen: (isShareScreen: boolean) => void;
    setTurnOnCamera: (isTurnOnCamera: boolean) => void;
    setMute: (isMute: boolean) => void;
    removeParticipantShareScreen: (socketId: string) => void;
    setRoom: (room: any) => void;
    setLayout: (layout?: string) => void;
    setConfirmLeave: (confirmLeave: boolean) => void;
    addUsersRequestJoinRoom: ({socketId, user}: {socketId: string; user: any}) => void;
    removeUsersRequestJoinRoom: (socketId: string) => void;
    setDoodle: (isDoodle: boolean) => void;
    setDoodleImage: (doodleImage: string) => void;
    setMeDoodle: (isMeDoole: boolean) => void;
    setDrawing: (isDrawing: boolean) => void;
    setConfirmStopDoodle: (confirmStopDoodle: boolean) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
    participants: [],
    isShareScreen: false,
    isTurnOnCamera: true,
    isMute: false,
    room: null,
    layout: VIDEOCALL_LAYOUTS.GALLERY_VIEW,
    confirmLeave: false,
    usersRequestJoinRoom: [],
    isDoodle: false,
    doodleImage: null,
    isMeDoole: false,
    isDrawing: false,
    confirmStopDoodle: false,
    colorDoodle: getRandomColor(),
    updateParticipant: (participants: ParicipantInVideoCall[]) => {
        set(() => ({ participants }));
    },
    addParticipant: (participant: ParicipantInVideoCall) => {
        set((state) => ({ participants: [...state.participants, participant] }));
    },
    setStreamForParticipant(stream: MediaStream, socketId: string, isShareScreen: boolean) {
        set((state) => ({
            participants: state.participants.map((p) => {
                if (p.socketId == socketId && p.isShareScreen == isShareScreen) {
                    return {
                        ...p,
                        stream
                    };
                }
                return p;
            }),
        }));
    },
    removeParticipant: (socketId: string) => {
        set((state) => ({
            participants: state.participants.filter((p) => p.socketId != socketId),
        }));
    },
    removeParticipantShareScreen: (socketId: string) => {
        set((state) => ({
            participants: state.participants.filter((p) => p.socketId != socketId || !p.isShareScreen),
        }));
    },
    setShareScreen: (isShareScreen: boolean) => {
        set(() => ({ isShareScreen }));
    },
    setTurnOnCamera: (isTurnOnCamera: boolean) => {
        set(() => ({ isTurnOnCamera }));
    },
    setMute: (isMute: boolean) => {
        set(() => ({ isMute }));
    },
    setRoom: (room: any) => {
        set(() => ({ room }));
    },
    setLayout: (layout?: string) => {
        set(() => ({ layout: layout || VIDEOCALL_LAYOUTS.GALLERY_VIEW }));
    },
    setConfirmLeave: (confirmLeave: boolean) => {
        set(() => ({ confirmLeave }));
    },
    addUsersRequestJoinRoom: ({socketId, user}: {socketId: string; user: any}) => {
        set((state) => ({ usersRequestJoinRoom: [...state.usersRequestJoinRoom, {socketId, user}] }));
    },
    removeUsersRequestJoinRoom: (socketId: string) => {
        set((state) => ({ usersRequestJoinRoom: state.usersRequestJoinRoom.filter((u) => u.socketId != socketId) }));
    },
    setDoodle: (isDoodle: boolean) => {
        set(() => ({ isDoodle }));
    },
    setDoodleImage: (doodleImage: string) => {
        set(() => ({ doodleImage }));
    },
    setMeDoodle: (isMeDoole: boolean) => {
        set(() => ({ isMeDoole }));
    },
    setDrawing: (isDrawing: boolean) => {
        set(() => ({ isDrawing }));
    },
    setConfirmStopDoodle: (confirmStopDoodle: boolean) => {
        set(() => ({ confirmStopDoodle }));
    }
}));
