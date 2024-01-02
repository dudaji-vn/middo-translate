import { create } from 'zustand';

interface ParicipantInVideoCall {
    peer?: any;
    user?: any;
    isMe?: boolean;
    stream?: MediaStream;
}
export type VideoCallState = {
    participants: ParicipantInVideoCall[];
    updateParticipant: (participants: ParicipantInVideoCall[]) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
    participants: [],
    updateParticipant: (participants: ParicipantInVideoCall[]) => {
        set(() => ({ participants }));
    },
}));
