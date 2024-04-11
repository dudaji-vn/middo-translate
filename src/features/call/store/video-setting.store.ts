import { create } from 'zustand';

export type VideoSettingState = {
    audio: MediaDeviceInfo | undefined;
    video: MediaDeviceInfo | undefined;
    speaker: MediaDeviceInfo | undefined;
    setAudio: (audio: MediaDeviceInfo) => void;
    setVideo: (video: MediaDeviceInfo) => void;
    setSpeaker: (speaker: MediaDeviceInfo) => void;
};

export const useVideoSettingStore = create<VideoSettingState>()((set) => ({
    audio: undefined,
    video: undefined,
    speaker: undefined,
    setAudio: (audio: MediaDeviceInfo) => {
        set(() => ({ audio }));
    },
    setVideo: (video: MediaDeviceInfo) => {
        set(() => ({ video }));
    },
    setSpeaker: (speaker: MediaDeviceInfo) => {
        set(() => ({ speaker }));
    },
}));
