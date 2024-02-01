import { useEffect } from 'react';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import ParticipantInVideoCall from '../../interfaces/participant';
import { SignalData } from 'simple-peer';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useAuthStore } from '@/stores/auth.store';
import { useMyVideoCallStore } from '../../store/me.store';
import { createPeer } from '../../utils/peer-action.util';
import { decoderData } from '../../utils/text-decoder-encoder';

export default function usePeerEvent() {
  const {
    participants,
    setStreamForParticipant,
    removeParticipant,
    updatePeerParticipant,
  } = useParticipantVideoCallStore();
  const { user } = useAuthStore();
  const { myStream } = useMyVideoCallStore();
  useEffect(() => {
    let listeners: any = {};
    participants.forEach(
      (participant: ParticipantInVideoCall, index: number) => {
        if (!participant.peer) return;
        const receiveStreamListener = (stream: any) => {
          setStreamForParticipant(
            stream,
            participant.socketId,
            participant.isShareScreen || false,
          );
        };
        const errorListener = (error: Error) => {
          participant.peer.destroy();
          setStreamForParticipant(
            new MediaStream(),
            participant.socketId,
            participant.isShareScreen || false,
          );
        };
        const closeListener = () => {
          participant.peer.destroy();
        };
        const signalListener = (signal: SignalData) => {
          switch (signal.type) {
            case 'offer':
              socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_SIGNAL, {
                id: participant.socketId,
                user,
                callerId: socket.id,
                signal,
                isShareScreen: participant.isShareScreen,
              });
              break;
            case 'answer':
            case 'candidate':
              socket.emit(SOCKET_CONFIG.EVENTS.CALL.RETURN_SIGNAL, {
                signal,
                callerId: participant.socketId,
                user,
                isShareScreen: participant.isShareScreen,
              });
              break;
            case 'transceiverRequest':
              const peer = createPeer();
              if (myStream) {
                peer.addStream(myStream);
              }
              updatePeerParticipant(peer, participant.socketId);
              break;
            case 'renegotiate':
              break;
            default:
              break;
          }
        };
        const receiveDataListener = (data: any) => {
            const decodeData = decoderData(data);
            switch (decodeData.type) {
                case 'STOP_STREAM':
                    setStreamForParticipant(new MediaStream(), participant.socketId, participant.isShareScreen || false);
                    break;
                default:
                    break;
            }
        }

        listeners = {
          ...listeners,
          [index]: {
            stream: receiveStreamListener,
            error: errorListener,
            close: closeListener,
            signal: signalListener,
            data: receiveDataListener,
          },
        };
        participant.peer.on('stream', receiveStreamListener);
        participant.peer.on('close', closeListener);
        participant.peer.on('error', errorListener);
        participant.peer.on('signal', signalListener);
        participant.peer.on('data', receiveDataListener);

      },
    );
    return () => {
      participants.forEach(
        (participant: ParticipantInVideoCall, index: number) => {
          if (!participant.peer) return;
          participant.peer.removeListener('stream', listeners[index].stream);
          participant.peer.removeListener('error', listeners[index].error);
          participant.peer.removeListener('close', listeners[index].close);
          participant.peer.removeListener('signal', listeners[index].signal);
          participant.peer.removeListener('data', listeners[index].data);
        },
      );
    };
  }, [
    myStream,
    participants,
    removeParticipant,
    setStreamForParticipant,
    updatePeerParticipant,
    user,
  ]);
}
