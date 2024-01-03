import { create } from 'zustand';
export const LAYOUTS = {
    VIEW: 'VIEW',
    SHARE_SCREEN: 'SHARE_SCREEN',
}
interface ParicipantInVideoCall {
    peer?: any;
    user?: any;
    isMe?: boolean;
    stream?: MediaStream;
    isShareScreen?: boolean;
    isTurnOnCamera?: boolean;
    isMute?: boolean;
    socketId: string;
}
export type VideoCallState = {
    participants: ParicipantInVideoCall[];
    updateParticipant: (participants: ParicipantInVideoCall[]) => void;
    addParticipant: (participant: ParicipantInVideoCall) => void;
    setStreamForParticipant: (stream: MediaStream, socketId: string, isShareScreen: boolean) => void;
    removeParticipant: (socketId: string) => void;
    isShareScreen?: boolean;
    isTurnOnCamera?: boolean;
    isMute?: boolean;
    setShareScreen: (isShareScreen: boolean) => void;
    setTurnOnCamera: (isTurnOnCamera: boolean) => void;
    setMute: (isMute: boolean) => void;
    roomId: string;
    setRoomId: (roomId: string) => void;
    removeParticipantShareScreen: (socketId: string) => void;
    room: any;
    setRoom: (room: any) => void;
    layout: keyof typeof LAYOUTS;
    setLayout: (layout: keyof typeof LAYOUTS) => void;
};

export const useVideoCallStore = create<VideoCallState>()((set) => ({
    participants: [],
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
    isShareScreen: false,
    isTurnOnCamera: true,
    isMute: false,
    setShareScreen: (isShareScreen: boolean) => {
        set(() => ({ isShareScreen }));
    },
    setTurnOnCamera: (isTurnOnCamera: boolean) => {
        set(() => ({ isTurnOnCamera }));
    },
    setMute: (isMute: boolean) => {
        set(() => ({ isMute }));
    },
    roomId: '',
    setRoomId: (roomId: string) => {
        set(() => ({ roomId }));
    },
    removeParticipantShareScreen: (socketId: string) => {
        set((state) => ({
            participants: state.participants.filter((p) => p.socketId != socketId || !p.isShareScreen),
        }));
    },
    room: {},
    setRoom: (room: any) => {
        set(() => ({ room }));
    },
    layout: 'VIEW',
    setLayout: (layout: keyof typeof LAYOUTS) => {
        set(() => ({ layout }));
    },
}));
