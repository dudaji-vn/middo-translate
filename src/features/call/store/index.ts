import { create } from 'zustand';

interface ParicipantInVideoCall {
    peerId?: string;
    name?: string;
    avatar?: string;
    isMuted?: boolean;
    isSpeaking?: boolean;
    isScreenSharing?: boolean;
    isVideoOn?: boolean;
    userId?: string;
    stream?: MediaStream;
}
export type VideoCallState = {
    showTranslateOnType: boolean;
    toggleShowTranslateOnType: () => void;
    showMiddleTranslation: boolean;
    toggleShowMiddleTranslation: () => void;
    videoCallIdInteract: string | null;
    setVideoCallIdInteract: (id: string) => void;
    participants: ParicipantInVideoCall[];
    myPeerId: string;
    myVideoStream: MediaStream | null;
    setMyVideoStream: (stream: MediaStream) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
    showTranslateOnType: true,
    toggleShowTranslateOnType: () =>
        set((state) => ({ showTranslateOnType: !state.showTranslateOnType })),
    showMiddleTranslation: true,
    toggleShowMiddleTranslation: () =>
        set((state) => ({ showMiddleTranslation: !state.showMiddleTranslation })),
    videoCallIdInteract: null,
    setVideoCallIdInteract: (id) => set(() => ({ videoCallIdInteract: id })),
    participants: [],
    addPaticipant: (participant: ParicipantInVideoCall) => {
        const isExist = useVideoCallStore.getState().participants.some(
            (p) => p.peerId === participant.peerId,
        );
        if (isExist) { 
            set((state) => ({
                participants: state.participants.map((p) =>
                    p.peerId === participant.peerId ? participant : p,
                ),
            }));
            return;
        }
        set((state) => ({ participants: [...state.participants, participant] }));
    },
    removeParticipant: (peerId: string) => {
        set((state) => ({
            participants: state.participants.filter((p) => p.peerId !== peerId),
        }));
    },
    myPeerId: '',
    setMyPeerId: (id: string) => set(() => ({ myPeerId: id })),
    myVideoStream: null,
    setMyVideoStream: (stream: MediaStream) => set(() => ({ myVideoStream: stream })),
}));
