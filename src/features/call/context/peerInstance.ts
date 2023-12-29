import Peer from "peerjs";

const peerConfig = {
    config: {
        iceServers: [{
            urls: "stun:34.134.1.106:3478"
        }],
        sdpSemantics: "unified-plan",
        iceTransportPolicy: "relay"
    }
}

const peerInstance = new Peer(peerConfig);
export default peerInstance;