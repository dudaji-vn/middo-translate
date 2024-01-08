export default interface ParicipantInVideoCall {
    peer?: any;
    user?: any;
    isMe?: boolean;
    stream?: MediaStream;
    isShareScreen?: boolean;
    socketId: string;
}