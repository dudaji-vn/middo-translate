import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import SimplePeer from "simple-peer";
import Peer from "simple-peer";


const peerConfigurations = {
    
}


interface CreatePeerParams {
    id: string;
    socketId: string;
    stream: MediaStream;
    user: any;
    isShareScreen?: boolean;
}
export const createPeer = ({ id, socketId, stream, user, isShareScreen = false } : CreatePeerParams) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) => {
        console.log('Send Signal: ', signal);
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_SIGNAL, { id, user, callerId: socketId, signal, isShareScreen })
    });
    return peer;
};

interface AddPeerParams {
    signal: SimplePeer.SignalData,
    callerId: string,
    stream: MediaStream,
    user: any,
    isShareScreen?: boolean
}

export const addPeer = ({signal, callerId, stream, user, isShareScreen} : AddPeerParams) => {
    const peer = new Peer({ initiator: false, trickle: true, stream })
    peer.on("signal", signal => {
        console.log('Return Signal: ', signal);
        if(signal.type == "transceiverRequest") return; // Ignore "transceiverRequest
        // Check is signal have stream
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.RETURN_SIGNAL, { signal, callerId, user, isShareScreen })
    })
    peer.signal(signal);
    return peer;
};