export default interface ParticipantInVideoCall {
    peer?: any;
    user?: any;
    isMe?: boolean;
    stream?: MediaStream;
    isShareScreen?: boolean;
    socketId: string;
    pin?: boolean;
    isElectron?: boolean;
}