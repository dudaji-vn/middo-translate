import { create } from 'zustand';
import DEFAULT_USER_CALL_STATE from '../constant/default-user-call-state';

export type MyVideoCallState = {
    myStream: MediaStream | undefined;
    isShareScreen: boolean;
    isTurnOnCamera: boolean;
    isTurnOnMic: boolean;
    shareScreenStream: MediaStream | undefined;
    myOldDoodle: any;
    isLoadingVideo: boolean;
    setMyStream: (stream?: MediaStream) => void;
    setShareScreen: (isShareScreen: boolean) => void;
    setTurnOnCamera: (isTurnOnCamera: boolean) => void;
    setTurnOnMic: (isTurnOnMic: boolean) => void;
    setShareScreenStream: (stream?: MediaStream) => void;
    setMyOldDoodle: (doodle: any) => void;
    setLoadingVideo: (isLoadingVideo: boolean) => void;
};

export const useMyVideoCallStore = create<MyVideoCallState>()((set) => ({
    myStream: undefined,
    isShareScreen: false,
    isTurnOnCamera: DEFAULT_USER_CALL_STATE.isTurnOnCamera,
    isTurnOnMic: DEFAULT_USER_CALL_STATE.isTurnOnMic,
    shareScreenStream: undefined,
    myOldDoodle: undefined,
    isLoadingVideo: false,
    setMyStream: (stream?: MediaStream) => {
        set(() => ({ myStream: stream }));
    },
    setShareScreen: (isShareScreen: boolean) => {
        set(() => ({ isShareScreen }));
    },
    setTurnOnCamera: (isTurnOnCamera: boolean) => {
        set(() => ({ isTurnOnCamera }));
    },
    setTurnOnMic: (isTurnOnMic: boolean) => {
        set(() => ({ isTurnOnMic }));
    },
    setShareScreenStream: (stream?: MediaStream) => {
        set(() => ({ shareScreenStream: stream }));
    },
    setMyOldDoodle: (doodle: any) => {
        set(() => ({ myOldDoodle: doodle }));
    },
    setLoadingVideo: (isLoadingVideo: boolean) => {
        set(() => ({ isLoadingVideo }));
    },
}));
