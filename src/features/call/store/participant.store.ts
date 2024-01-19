import { create } from 'zustand';
import ParicipantInVideoCall from '../interfaces/participant';

export type VideoCallState = {
    participants: ParicipantInVideoCall[];
    usersRequestJoinRoom: any[];
    peerShareScreen: any[];
    addPeerShareScreen: (peer: any) => void;
    removePeerShareScreen: (id: string) => void;
    clearPeerShareScreen: () => void;
    updateParticipant: (participants: ParicipantInVideoCall[]) => void;
    addParticipant: (participant: ParicipantInVideoCall) => void;
    setStreamForParticipant: (stream: MediaStream, socketId: string, isShareScreen: boolean) => void;
    removeParticipant: (socketId: string) => void;
    removeParticipantShareScreen: (socketId: string) => void;
    updatePeerParticipant: (peer: any, socketId: string) => void;
    addUsersRequestJoinRoom: ({socketId, user}: {socketId: string; user: any}) => void;
    removeUsersRequestJoinRoom: (socketId: string) => void;
    pinParticipant: (socketId: string, isShareScreen: boolean) => void;
    clearPinParticipant: () => void;
    resetParticipants: () => void;
    resetUsersRequestJoinRoom: () => void;
};

export const useParticipantVideoCallStore = create<VideoCallState>()((set) => ({
    participants: [],
    usersRequestJoinRoom: [],
    peerShareScreen: [],
    updateParticipant: (participants: ParicipantInVideoCall[]) => {
        set(() => ({ participants }));
    },
    addParticipant: (participant: ParicipantInVideoCall) => {
        set((state) => ({ participants: [...state.participants, participant] }));
    },
    setStreamForParticipant(stream: MediaStream, socketId: string, isShareScreen: boolean) {
        set((state) => ({
            participants: state.participants.map((p) => {
                if (p.socketId == socketId && (p.isShareScreen || false) == isShareScreen) {
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
    addPeerShareScreen: (peer: any) => {
        set((state) => ({ peerShareScreen: state.peerShareScreen.concat(peer) }));
    },
    removePeerShareScreen: (id: string) => {
        set((state) => ({ peerShareScreen: state.peerShareScreen.filter((p) => p.id != id) }));
    },
    clearPeerShareScreen: () => {
        set((state) => {
            state.peerShareScreen.forEach((p: any) => {
                if(!p?.peer) return;
                p?.peer?.destroy();
            });
            return { peerShareScreen: [] };
        });
    },
    updatePeerParticipant: (peer: any, socketId: string) => {
        set((state) => ({
            participants: state.participants.map((p) => {
                if (p.socketId == socketId && !p.isShareScreen) {
                    return {
                        ...p,
                        peer
                    };
                }
                return p;
            }),
        }));
    },
    addUsersRequestJoinRoom: ({socketId, user}: {socketId: string; user: any}) => {
        set((state) => ({ usersRequestJoinRoom: state.usersRequestJoinRoom.concat({socketId, user}) }));
    },
    removeUsersRequestJoinRoom: (socketId: string) => {
        set((state) => ({ usersRequestJoinRoom: state.usersRequestJoinRoom.filter((u) => u.socketId != socketId) }));
    },
    pinParticipant: (socketId: string, isShareScreen: boolean) => {
        set((state) => ({
            participants: state.participants.map((p) => {
                if (p.socketId == socketId && (p.isShareScreen || false) == (isShareScreen || false)) {
                    return {
                        ...p,
                        pin: true
                    };
                }
                return {
                    ...p,
                    pin: false
                };
            }),
        }));
    },
    clearPinParticipant: () => {
        set((state) => ({
            participants: state.participants.map((p) => {
                return {
                    ...p,
                    pin: false
                };
            }),
        }));
    },
    resetParticipants: () => {
        set(() => ({ participants: [] }));
    },
    resetUsersRequestJoinRoom: () => {
        set(() => ({ usersRequestJoinRoom: [] }));
    },
}));
