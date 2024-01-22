import { useEffect, useState } from "react";
import ParicipantInVideoCall from "../interfaces/participant";
import { useParticipantVideoCallStore } from "../store/participant.store";

export default function useLoadStream(participant: ParicipantInVideoCall, elementRef: React.RefObject<HTMLVideoElement>) {
    const [streamVideo, setStreamVideo] = useState<MediaStream>()
    const [isTurnOnMic, setTurnOnMic] = useState<boolean>(false)
    const [isTurnOnCamera, setIsTurnOnCamera] = useState<boolean>(false)
    const { setStreamForParticipant, removeParticipant } = useParticipantVideoCallStore();
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        if(!elementRef.current || !participant) return;
        if(participant.stream) {
            const isMicOn = !participant.stream.getAudioTracks()[0]?.enabled || false;
            const isCamOn = participant.stream.getVideoTracks()[0]?.enabled || false;
            let tempStream = new MediaStream();
            if(participant.isMe) {
                elementRef.current.muted = true;
                elementRef.current.volume = 0;
                if(participant.stream.getVideoTracks()[0]) {
                    const videoTrack = participant.stream.getVideoTracks()[0]
                    tempStream.addTrack(videoTrack)
                }
            } else {
                tempStream = participant.stream;
                elementRef.current.volume = 0.9;
            }
            elementRef.current!.srcObject = tempStream;
            setStreamVideo(tempStream)
            setTurnOnMic(isMicOn)
            setIsTurnOnCamera(isCamOn)
            elementRef.current.addEventListener('loadedmetadata', () => {
                setIsLoaded(true)
            })
            elementRef.current.play()
        }
        if(!participant.peer) return;
        participant.peer.on('stream', (stream: any) => {
            if(!elementRef.current) return;
            setStreamForParticipant(stream, participant.socketId, participant.isShareScreen || false)
        })
        // participant.peer.on('track', (track: any) => {
        //     console.log('track', track)
        // })
        // close
        participant.peer.on('close', () => {
            console.log('close')
        })
        participant.peer.on('error', (error: any) => {
            participant.peer.destroy()
            removeParticipant(participant.socketId)
        })
        
    }, [elementRef, participant, removeParticipant, setStreamForParticipant])
    return {
        streamVideo,
        isTurnOnMic,
        isTurnOnCamera,
        isLoaded
    }

}