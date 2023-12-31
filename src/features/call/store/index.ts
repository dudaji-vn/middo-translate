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
    user?: any;
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
    addParticipant: (participant: ParicipantInVideoCall) => void;
    removeParticipant: (peerId: string) => void;
    updateParticipant: (participants: ParicipantInVideoCall[]) => void;
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
    addParticipant: (participant: ParicipantInVideoCall) => {
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
    updateParticipant: (participants: ParicipantInVideoCall[]) => {
        set(() => ({ participants }));
    },
    myPeerId: '',
    setMyPeerId: (id: string) => set(() => ({ myPeerId: id })),
    myVideoStream: null,
    setMyVideoStream: (stream: MediaStream) => set(() => ({ myVideoStream: stream })),
}));
