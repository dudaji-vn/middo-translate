import Peer from 'simple-peer';
import { User } from "@/features/users/types";

export const StatusParticipant: {
    WAITING: 'WAITING';
    DECLINE: 'DECLINE';
    JOINED: 'JOINED';
    WAITING_HELP_DESK: 'WAITING_HELP_DESK';
} =  {
    WAITING: 'WAITING',
    DECLINE: 'DECLINE',
    JOINED: 'JOINED',
    WAITING_HELP_DESK: 'WAITING_HELP_DESK',
}

export type StatusParticipantType = keyof typeof StatusParticipant;
export default interface ParticipantInVideoCall {
    peer?: Peer.Instance;
    user: User;
    isMe?: boolean;
    stream?: MediaStream;
    isShareScreen?: boolean;
    socketId: string;
    pin?: boolean;
    isElectron?: boolean;
    status?: 'WAITING' | 'DECLINE' | 'JOINED' | 'WAITING_HELP_DESK';
    isTurnOnCamera?: boolean;
    isTurnOnMic?: boolean;
}
