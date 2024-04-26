import { create } from 'zustand';
import ParticipantInVideoCall, { StatusParticipantType } from '../interfaces/participant';

export type VideoCallState = {
    participants: ParticipantInVideoCall[];
    usersRequestJoinRoom: any[];
    peerShareScreen: any[];
    addPeerShareScreen: (peer: any) => void;
    removePeerShareScreen: (id: string) => void;
    clearPeerShareScreen: () => void;
    updateParticipant: (participant: ParticipantInVideoCall, userId: string) => void;
    addParticipant: (participant: ParticipantInVideoCall) => void;
    setStreamForParticipant: (stream: MediaStream, socketId: string, isShareScreen: boolean) => void;
    removeParticipant: (socketId: string) => void;
    removeParticipantByUserId: (userId: string) => void;
    removeParticipantShareScreen: (socketId: string) => void;
    updatePeerParticipant: (peer: any, socketId: string) => void;
    addUsersRequestJoinRoom: ({socketId, user}: {socketId: string; user: any}) => void;
    removeUsersRequestJoinRoom: (socketId: string) => void;
    updateStatusParticipant: (userId: string, status: StatusParticipantType) => void;
    pinParticipant: (socketId: string, isShareScreen: boolean) => void;
    clearPinParticipant: () => void;
    resetParticipants: () => void;
    resetUsersRequestJoinRoom: () => void;
};

export const useParticipantVideoCallStore = create<VideoCallState>()((set) => ({
    participants: [],
    usersRequestJoinRoom: [],
    peerShareScreen: [],
    updateParticipant: (participant: ParticipantInVideoCall, userId: string) => {
        set((state) => ({
            participants: state.participants.map((p) => {
                if (p.user._id == userId) {
                    return participant;
                }
                return p;
            }),
        }));
    },
    addParticipant: (participant: ParticipantInVideoCall) => {
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
    removeParticipantByUserId(userId) {
        set((state) => ({
            participants: state.participants.filter((p) => p.user._id != userId),
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
        set((state) => ({ peerShareScreen: []}));
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
    updateStatusParticipant: (userId: string, status: StatusParticipantType) => {
        set((state) => ({
            participants: state.participants.map((p) => {
                if (p.user._id == userId) {
                    return {
                        ...p,
                        status
                    };
                }
                return p;
            }),
        }));
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
