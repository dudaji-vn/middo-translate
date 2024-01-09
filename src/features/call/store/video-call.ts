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
    setRoom: (room: any) => void;
    setLayout: (layout?: string) => void;
    setConfirmLeave: (confirmLeave: boolean) => void;
    setDoodle: (isDoodle: boolean) => void;
    setDoodleImage: (doodleImage: string) => void;
    setMeDoodle: (isMeDoole: boolean) => void;
    setDrawing: (isDrawing: boolean) => void;
    setConfirmStopDoodle: (confirmStopDoodle: boolean) => void;
    setFullScreen: (isFullScreen: boolean) => void;
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
    }
}));
