import { useEffect, useState } from "react";
import ParicipantInVideoCall from "../interfaces/participant";
import { useParticipantVideoCallStore } from "../store/participant";

export default function useLoadStream(participant: ParicipantInVideoCall, elementRef: React.RefObject<HTMLVideoElement>) {
    const [streamVideo, setStreamVideo] = useState<MediaStream>()
    const [isTurnOnMic, setTurnOnMic] = useState<boolean>(false)
    const [isTurnOnCamera, setIsTurnOnCamera] = useState<boolean>(false)
    const { setStreamForParticipant, removeParticipant } = useParticipantVideoCallStore();
    
    useEffect(() => {
        if(!elementRef.current || !participant) return;
        if(participant.stream) {
            const isMicOn = !participant.stream.getAudioTracks()[0]?.enabled || false;
            const isCamOn = participant.stream.getVideoTracks()[0]?.enabled || false;
            let tempStream = new MediaStream();
            if(participant.isMe) {
                if(participant.stream.getVideoTracks()[0]) {
                    const videoTrack = participant.stream.getVideoTracks()[0]
                    tempStream.addTrack(videoTrack)
                }
            } else {
                tempStream = participant.stream;
            }
            elementRef.current!.srcObject = tempStream;
            setStreamVideo(tempStream)
            setTurnOnMic(isMicOn)
            setIsTurnOnCamera(isCamOn)
            // const audioTrack = tempStream.getAudioTracks()[0];
            // const videoTrack = tempStream.getVideoTracks()[0];
            // if(audioTrack) {
            //     audioTrack.addEventListener('enabled', ()=>{
            //         console.log('audioTrack::', audioTrack.enabled)
            //     })
            // }
            // if(videoTrack) {
            //     videoTrack.addEventListener('enabled', ()=>{
            //         console.log('videoTrack::', videoTrack.enabled)
            //     })
            // }
        }
        if(!participant.peer) return;
        participant.peer.on('stream', (stream: any) => {
            if(!elementRef.current) return;
            setStreamForParticipant(stream, participant.socketId, participant.isShareScreen || false)
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
    }

}