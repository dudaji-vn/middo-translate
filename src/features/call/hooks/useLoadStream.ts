import { useEffect, useState } from "react";
import { ParicipantInVideoCall, useVideoCallStore } from "../store";

export default function useLoadStream(participant: ParicipantInVideoCall, elementRef: React.RefObject<HTMLVideoElement>) {
    const [streamVideo, setStreamVideo] = useState<MediaStream>()
    const [isMute, setIsMute] = useState<boolean>(false)
    const [isTurnOnCamera, setIsTurnOnCamera] = useState<boolean>(false)
    const { setStreamForParticipant } = useVideoCallStore();
    useEffect(() => {
        if(!elementRef.current) return;
        const updateStreamVideo = (stream: MediaStream) => {
            elementRef.current!.srcObject = stream;
            setStreamVideo(stream)
            const isMute = !stream.getAudioTracks()[0]?.enabled;
            const isTurnOnCamera = stream.getVideoTracks()[0]?.enabled;
            setIsMute(isMute)
            setIsTurnOnCamera(isTurnOnCamera)
        }

        if(participant.stream) {
            if(participant.isMe) {
                // console.log('mute')
            }
            updateStreamVideo(participant.stream)
            return;
        }
        participant.peer.on('stream', (stream: any) => {
            // console.log('stream', stream)
            if(!elementRef.current) return;
            updateStreamVideo(stream)
            setStreamForParticipant(stream, participant.socketId, participant.isShareScreen || false)
        })
        participant.peer.on('track', (track: any, stream: any) => {
            // console.log('track', track, stream)
            if(!elementRef.current) return;
            updateStreamVideo(stream)
            setStreamForParticipant(stream, participant.socketId, participant.isShareScreen || false)
        })
        participant.peer.on('replaceTrack', (track: any, stream: any) => {
            // console.log('replaceTrack', track, stream)
            if(!elementRef.current) return;
            updateStreamVideo(stream)
            setStreamForParticipant(stream, participant.socketId, participant.isShareScreen || false)
        })
        return () => {
            if(participant.stream) {
                participant.stream.getTracks().forEach((track: any) => {
                    track.stop();
                });
            }
        }
    }, [elementRef, participant.isMe, participant.isShareScreen, participant.peer, participant.socketId, participant.stream, setStreamForParticipant])
    return {
        streamVideo,
        isMute,
        isTurnOnCamera,
    }

}