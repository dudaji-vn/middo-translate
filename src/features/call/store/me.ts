import { create } from 'zustand';
import DEFAULT_USER_CALL_STATE from '../constant/default-user-call-state';

export type MyVideoCallState = {
    myStream: MediaStream | undefined;
    isShareScreen: boolean;
    isTurnOnCamera: boolean;
    isMute: boolean;
    setMyStream: (stream?: MediaStream) => void;
    setShareScreen: (isShareScreen: boolean) => void;
    setTurnOnCamera: (isTurnOnCamera: boolean) => void;
    setMute: (isMute: boolean) => void;
};

export const useMyVideoCallStore = create<MyVideoCallState>()((set) => ({
    myStream: undefined,
    isShareScreen: false,
    isTurnOnCamera: DEFAULT_USER_CALL_STATE.isTurnOnCamera,
    isMute: DEFAULT_USER_CALL_STATE.isMute,
    setMyStream: (stream?: MediaStream) => {
        set(() => ({ myStream: stream }));
    },
    setShareScreen: (isShareScreen: boolean) => {
        set(() => ({ isShareScreen }));
    },
    setTurnOnCamera: (isTurnOnCamera: boolean) => {
        set(() => ({ isTurnOnCamera }));
    },
    setMute: (isMute: boolean) => {
        set(() => ({ isMute }));
    }
}));
