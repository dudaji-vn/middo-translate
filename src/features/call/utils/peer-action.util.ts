import moment from 'moment';
import Peer, { SignalData } from 'simple-peer';

const peerConfigurations = {
  iceServers: [
    {
      urls:
        process.env.NEXT_PUBLIC_TURN_SERVER_URL ||
        'stun:stun.l.google.com:19302',
      username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME || '',
      credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIALS || '',
    },
  ],
};

export const createPeer = () => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    config: peerConfigurations,
  });
  return peer;
};
export const addPeer = (signal: SignalData) => {
  const peer = new Peer({
    initiator: false,
    trickle: true,
    config: peerConfigurations,
  });
  peer.signal(signal);
  return peer;
};

