import { useEffect, useState } from "react";
import ParicipantInVideoCall from "../interfaces/participant";
import { useParticipantVideoCallStore } from "../store/participant";

export default function useLoadStream(participant: ParicipantInVideoCall, elementRef: React.RefObject<HTMLVideoElement>) {
    const [streamVideo, setStreamVideo] = useState<MediaStream>()
    const [isMute, setIsMute] = useState<boolean>(false)
    const [isTurnOnCamera, setIsTurnOnCamera] = useState<boolean>(false)
    const { setStreamForParticipant } = useParticipantVideoCallStore();
    useEffect(() => {
        if(!elementRef.current || !participant) return;
        if(participant.stream) {
            const isMute = !participant.stream.getAudioTracks()[0]?.enabled;
            const isTurnOnCamera = participant.stream.getVideoTracks()[0]?.enabled;
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
            setIsMute(isMute)
            setIsTurnOnCamera(isTurnOnCamera)
        }
        if(!participant.peer) return;
        participant.peer.on('stream', (stream: any) => {
            if(!elementRef.current) return;

            setStreamForParticipant(stream, participant.socketId, participant.isShareScreen || false)
        })
    }, [elementRef, participant, setStreamForParticipant])
    return {
        streamVideo,
        isMute,
        isTurnOnCamera,
    }

}