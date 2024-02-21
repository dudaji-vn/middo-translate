import { useEffect, useState } from "react";
import ParticipantInVideoCall from "../interfaces/participant";
import { useParticipantVideoCallStore } from "../store/participant.store";

export default function useLoadStream(participant: ParticipantInVideoCall, elementRef: React.RefObject<HTMLVideoElement>) {
    const [streamVideo, setStreamVideo] = useState<MediaStream>()
    const [isTurnOnMic, setTurnOnMic] = useState<boolean>(false)
    const [isTurnOnCamera, setIsTurnOnCamera] = useState<boolean>(false)
    const { setStreamForParticipant, removeParticipant } = useParticipantVideoCallStore();
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        if(!elementRef.current || !participant) return;
        if(!participant.stream) return;
        const isMicOn = participant.stream.getAudioTracks()[0]?.enabled || false;
        const isCamOn = participant.stream.getVideoTracks()[0]?.enabled || false;
        let tempStream = new MediaStream();
        if(participant.isMe) {
            if(participant.stream.getVideoTracks()[0]) {
                const videoTrack = participant.stream.getVideoTracks()[0]
                tempStream.addTrack(videoTrack)
            }
        } else {
            tempStream = participant.stream;
            elementRef.current.volume = 0.9;
        }
        elementRef.current.muted = true;
        elementRef.current.volume = 0;
        elementRef.current!.srcObject = tempStream;
        elementRef.current!.autoplay = true;
        setStreamVideo(tempStream)
        setTurnOnMic(isMicOn)
        setIsTurnOnCamera(isCamOn)

        const loadMetadataSuccess = () => {
            setIsLoaded(true)
        }
        
        // Add event stop for stream
        const handleVideoTrackEnded = () => {
            setIsTurnOnCamera(false)
        }
        const elementRefCurrent = elementRef.current;
        elementRef.current.addEventListener('loadedmetadata', loadMetadataSuccess)
        
        tempStream.addEventListener('inactive', handleVideoTrackEnded)
        if(tempStream.getVideoTracks()[0]) {
            tempStream.getVideoTracks()[0].addEventListener('ended', handleVideoTrackEnded)
        }
        elementRef.current.play().then(()=>{}).catch(()=>{})

        return () => {
            if(elementRefCurrent) {
                elementRefCurrent.removeEventListener('loadedmetadata', loadMetadataSuccess)
            }
            tempStream.removeEventListener('inactive', handleVideoTrackEnded)
            if(tempStream?.getVideoTracks()[0]) {
                tempStream.getVideoTracks()[0].removeEventListener('ended', handleVideoTrackEnded)
            }
        }
        
    }, [elementRef, participant, removeParticipant, setStreamForParticipant])
    return {
        streamVideo,
        isTurnOnMic,
        isTurnOnCamera,
        isLoaded,
    }

}