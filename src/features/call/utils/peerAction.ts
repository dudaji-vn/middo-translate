import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import SimplePeer from "simple-peer";
import Peer from "simple-peer";

const peerConfigurations = {
    iceServers: [
        {
            urls: process.env.NEXT_PUBLIC_TURN_SERVER_URL || "stun:stun.l.google.com:19302",
            username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME || "",
            credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIALS || "",
        }
    ],
};

interface CreatePeerParams {
    id: string;
    socketId: string;
    stream: MediaStream;
    user: any;
    isShareScreen?: boolean;
}
export const createPeer = ({ id, socketId, stream, user, isShareScreen = false } : CreatePeerParams) => {
    const peer = new Peer({ initiator: true, trickle: false, stream, config: peerConfigurations });
    peer.on("signal", (signal) => {
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
    const peer = new Peer({ initiator: false, trickle: true, stream, config: peerConfigurations })
    peer.on("signal", signal => {
        if(signal.type == "transceiverRequest") return; // Ignore "transceiverRequest
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.RETURN_SIGNAL, { signal, callerId, user, isShareScreen })
    })
    peer.on("iceCandidate", (iceCandidate) => {
        console.log("iceCandidate222", iceCandidate);
    });
    peer.signal(signal);
    return peer;
};