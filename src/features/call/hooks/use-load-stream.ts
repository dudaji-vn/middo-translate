import { useEffect, useState } from "react";
import ParticipantInVideoCall from "../interfaces/participant";
import { useParticipantVideoCallStore } from "../store/participant.store";
import { useVideoSettingStore } from "../store/video-setting.store";

export default function useLoadStream(participant: ParticipantInVideoCall, elementRef: React.RefObject<HTMLVideoElement>) {
    const setStreamForParticipant = useParticipantVideoCallStore(state => state.setStreamForParticipant)
    const removeParticipant = useParticipantVideoCallStore(state => state.removeParticipant)
    const [isTurnOnMic, setTurnOnMic] = useState<boolean>(false)
    const [isTurnOnCamera, setIsTurnOnCamera] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const speaker = useVideoSettingStore(state => state.speaker);
    
    useEffect(() => {
        const elementRefCurrent = elementRef.current;
        let tempStream = new MediaStream();
        const loadMetadataSuccess = () => {
            setIsLoaded(true)
        }
        // Add event stop for stream
        const handleVideoTrackEnded = () => {
            setIsTurnOnCamera(false)
        }
        const init = async () => {
            if(!elementRef.current || !participant) return;
            if(!participant.stream) return;
            // console.log('🔵useLoadStream')
            const isMicOn = participant.stream.getAudioTracks()[0]?.enabled || false;
            const isCamOn = participant.stream.getVideoTracks()[0]?.enabled || false;
            if(participant.isMe) {
                // if(participant.stream.getVideoTracks()[0]) {
                //     const videoTrack = participant.stream.getVideoTracks()[0]
                //     tempStream.addTrack(videoTrack)
                // }
                elementRef.current.volume = 0;
                elementRef.current.muted = true;
                // Remove audio track for me
                // if(participant.stream.getAudioTracks()[0]) {
                //     participant.stream.getAudioTracks()[0].enabled = false
                // }
            } else {
                elementRef.current.volume = 0.9;
            }
            // elementRef.current.volume = 0;
            // elementRef.current.muted = true;
            elementRef.current!.srcObject = participant.stream;
            elementRef.current!.autoplay = true;
            setTurnOnMic(isMicOn)
            setIsTurnOnCamera(isCamOn)
            
            elementRef.current.addEventListener('loadedmetadata', loadMetadataSuccess)
            
            tempStream.addEventListener('inactive', handleVideoTrackEnded)
            if(tempStream.getVideoTracks()[0]) {
                tempStream.getVideoTracks()[0].addEventListener('ended', handleVideoTrackEnded)
            }
            
            elementRef.current.play().then(()=>{}).catch(()=>{})
        }
        init()

        return () => {
            if(elementRefCurrent) {
                elementRefCurrent.removeEventListener('loadedmetadata', loadMetadataSuccess)
            }
            // tempStream.removeEventListener('inactive', handleVideoTrackEnded)
            // if(tempStream?.getVideoTracks()[0]) {
            //     tempStream.getVideoTracks()[0].removeEventListener('ended', handleVideoTrackEnded)
            // }
        }
        
    }, [elementRef, participant, removeParticipant, setStreamForParticipant])


    useEffect(() => {
        if(!elementRef.current || !participant) return;
        if(!participant.stream || participant.isMe) return;
        const isMicOn = participant.stream.getAudioTracks()[0]?.enabled || false;
        if(!isMicOn) return;
        if(!speaker?.deviceId) return;
        // @ts-ignore
        if(typeof elementRef.current!.setSinkId === 'function' && isMicOn) {
            // @ts-ignore
            elementRef.current?.setSinkId(speaker?.deviceId || '')
        }
    }, [elementRef, participant, speaker?.deviceId])

    return {
        isTurnOnMic,
        isTurnOnCamera,
        isLoaded,
    }

}