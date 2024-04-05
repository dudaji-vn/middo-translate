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

export const createPeer = (stream?: MediaStream) => {
  const obj: {stream?: MediaStream} = {}
  if(stream) obj['stream'] = stream;
  const peer = new Peer({
    initiator: true,
    trickle: false,
    config: peerConfigurations,
    ...obj
  });
  return peer;
};
export const addPeer = () => {
  const peer = new Peer({
    initiator: false,
    trickle: true,
    config: peerConfigurations,
  });
  return peer;
};

