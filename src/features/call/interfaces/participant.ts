import { User } from "@/features/users/types";

export const StatusParticipant: {
    WAITING: 'WAITING';
    DECLINE: 'DECLINE';
    JOINED: 'JOINED';
} =  {
    WAITING: 'WAITING',
    DECLINE: 'DECLINE',
    JOINED: 'JOINED',
}

export type StatusParticipantType = keyof typeof StatusParticipant;
export default interface ParticipantInVideoCall {
    peer?: any;
    user: User;
    isMe?: boolean;
    stream?: MediaStream;
    isShareScreen?: boolean;
    socketId: string;
    pin?: boolean;
    isElectron?: boolean;
    status?: 'WAITING' | 'DECLINE' | 'JOINED';
}
