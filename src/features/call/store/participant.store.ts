import Peer from 'simple-peer';
import { create } from 'zustand';
import ParticipantInVideoCall, { StatusParticipantType } from '../interfaces/participant';
import { User } from '@/features/users/types';
export interface IUserRequestJoinRoom {
    socketId: string;
    user: User
}
export interface IPeerShareScreen {
    id: string; // socket Id
    peer: Peer.Instance
}
export type VideoCallState = {
    changeMicStatusParticipant: (userId: string, status: boolean) => void;
    participants: ParticipantInVideoCall[];
    usersRequestJoinRoom: IUserRequestJoinRoom[];
    peerShareScreen: IPeerShareScreen[];
    addPeerShareScreen: (peer: IPeerShareScreen) => void;
    removePeerShareScreen: (id: string) => void;
    clearPeerShareScreen: () => void;
    updateParticipant: (participant: ParticipantInVideoCall, userId: string) => void;
    addParticipant: (participant: ParticipantInVideoCall) => void;
    setStreamForParticipant: (stream: MediaStream, socketId: string, isShareScreen: boolean) => void;
    removeParticipant: (socketId: string) => void;
    removeParticipantByUserId: (userId: string) => void;
    removeParticipantShareScreen: (socketId: string) => void;
    updatePeerParticipant: (peer: Peer.Instance, socketId: string) => void;
    addUsersRequestJoinRoom: ({socketId, user}: {socketId: string; user: User}) => void;
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
    addPeerShareScreen: (peer: IPeerShareScreen) => {
        set((state) => ({ peerShareScreen: state.peerShareScreen.concat(peer) }));
    },
    removePeerShareScreen: (id: string) => {
        set((state) => ({ peerShareScreen: state.peerShareScreen.filter((p) => p.id != id) }));
    },
    clearPeerShareScreen: () => {
        set((_) => ({ peerShareScreen: []}));
    },
    updatePeerParticipant: (peer: Peer.Instance, socketId: string) => {
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
    addUsersRequestJoinRoom: ({socketId, user}: {socketId: string; user: User}) => {
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
    changeMicStatusParticipant: (userId: string, isTurnOnMic: boolean) => {
        set((state) => ({
            participants: state.participants.map((p) => {
                if (p.user._id == userId) {
                    return {
                        ...p,
                        isTurnOnMic
                    };
                }
                return p;
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
