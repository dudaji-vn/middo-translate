import { create } from 'zustand';
import {VIDEOCALL_LAYOUTS} from '../constant/layout';
import getRandomColor from '../utils/get-random-color.util';

export type VideoCallState = {
    room: any;
    layout: string;
    confirmLeave: boolean;
    isDoodle: boolean;
    isDrawing: boolean;
    doodleImage: string | null;
    isMeDoole: boolean;
    confirmStopDoodle: boolean;
    colorDoodle: string;
    isFullScreen: boolean;
    isPinDoodle: boolean;
    isPinShareScreen: boolean;
    tmpRoom: any;
    isShowChat: boolean;
    isShowCaption: boolean;
    setRoom: (room: any) => void;
    setLayout: (layout?: string) => void;
    setConfirmLeave: (confirmLeave: boolean) => void;
    setDoodle: (isDoodle: boolean) => void;
    setDoodleImage: (doodleImage: string) => void;
    setMeDoodle: (isMeDoole: boolean) => void;
    setDrawing: (isDrawing: boolean) => void;
    setConfirmStopDoodle: (confirmStopDoodle: boolean) => void;
    setFullScreen: (isFullScreen: boolean) => void;
    setPinDoodle: (isPinDoodle: boolean) => void;
    setPinShareScreen: (isPinShareScreen: boolean) => void;
    setTempRoom: (tmpRoom: any) => void;
    setShowChat: (isShowChat: boolean) => void;
    setShowCaption: (isShowCaption: boolean) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
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
    peerShareScreen: [],
    isFullScreen: false,
    isPinDoodle: false,
    isPinShareScreen: false,
    tmpRoom: null,
    isShowChat: true,
    isShowCaption: false,
    setRoom: (room: any) => {
        set(() => ({ room }));
    },
    setLayout: (layout?: string) => {
        set(() => ({ layout: layout || VIDEOCALL_LAYOUTS.GALLERY_VIEW }));
    },
    setConfirmLeave: (confirmLeave: boolean) => {
        set(() => ({ confirmLeave }));
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
    },
    setFullScreen: (isFullScreen: boolean) => {
        set(() => ({ isFullScreen }));
    },
    setPinDoodle: (isPinDoodle: boolean) => {
        if(isPinDoodle) set(()=>({isPinShareScreen: false}))
        set(() => ({ isPinDoodle }));
    },
    setPinShareScreen: (isPinShareScreen: boolean) => {
        if(isPinShareScreen) set(()=>({isPinDoodle: false}))
        set(() => ({ isPinShareScreen }));
    },
    setTempRoom: (tmpRoom: any) => {
        set(() => ({ tmpRoom }));
    },
    setShowChat: (isShowChat: boolean) => {
        set(() => ({ isShowChat }));
    },
    setShowCaption: (isShowCaption: boolean) => {
        set(() => ({ isShowCaption }));
    },
}));
