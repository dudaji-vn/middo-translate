import { useEffect, useState } from "react";
import { useVideoCallStore } from "../store";

export default function useLoadStream(participant: any, elementRef: React.RefObject<HTMLVideoElement>) {
    const [streamVideo, setStreamVideo] = useState<MediaStream>()
    const { setStreamForParticipant } = useVideoCallStore();
    useEffect(() => {
        if(!elementRef.current) return;
        if(participant.stream) {
            elementRef.current!.srcObject = participant.stream;
            setStreamVideo(participant.stream)
            return;
        }
        participant.peer.on('stream', (stream: any) => {
            if(!elementRef.current) return;
            elementRef.current!.srcObject = stream
            setStreamVideo(stream)
            setStreamForParticipant(stream, participant.socketId, participant.isShareScreen)
        })
    }, [elementRef, participant.isShareScreen, participant.peer, participant.socketId, participant.stream, setStreamForParticipant])
    return {
        streamVideo
    }

}