import { useEffect } from "react";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import ParticipantInVideoCall from "../../interfaces/participant";

export default function usePeerEvent() {
    const { participants, setStreamForParticipant, removeParticipant } = useParticipantVideoCallStore();
    useEffect(() => {
        let listeners: any = {}

        participants.forEach((participant: ParticipantInVideoCall, index: number) => {
            
            if(!participant.peer) return;
            const receiveStreamListener = (stream: any) => {
                // console.log('Got new stream from Peer::', stream)
                setStreamForParticipant(stream, participant.socketId, participant.isShareScreen || false)
            }
            const errorListener = (error: any) => {
                participant.peer.destroy()
                removeParticipant(participant.socketId)
            }
            const closeListener = () => {
                // console.log('Close')
            }
            listeners = {
                ...listeners,
                [index]: {
                    stream: receiveStreamListener,
                    error: errorListener,
                    close: closeListener,
                },
            }
            participant.peer.on('stream', receiveStreamListener)
            participant.peer.once('close', closeListener)
            participant.peer.on('error', errorListener)
        });
        return ()=> {
            participants.forEach((participant: ParticipantInVideoCall, index: number) => {
                if(!participant.peer) return;
                participant.peer.removeListener('stream', listeners[index].stream)
                participant.peer.removeListener('error', listeners[index].error)
                participant.peer.removeListener('close', listeners[index].close)
            });
        }
    }, [participants, removeParticipant, setStreamForParticipant])
}