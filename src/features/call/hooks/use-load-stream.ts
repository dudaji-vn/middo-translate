import { useEffect, useState } from "react";
import ParticipantInVideoCall from "../interfaces/participant";
import { useParticipantVideoCallStore } from "../store/participant.store";
import { useVideoSettingStore } from "../store/video-setting.store";

export default function useLoadStream(participant: ParticipantInVideoCall, elementRef: React.RefObject<HTMLVideoElement>) {
    const setStreamForParticipant = useParticipantVideoCallStore(state => state.setStreamForParticipant)
    const removeParticipant = useParticipantVideoCallStore(state => state.removeParticipant)
    const [streamVideo, setStreamVideo] = useState<MediaStream>()
    const [isTurnOnMic, setTurnOnMic] = useState<boolean>(false)
    const [isTurnOnCamera, setIsTurnOnCamera] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    // const speaker = useVideoSettingStore(state => state.speaker);
    // console.log('🔵useLoadStream')
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
            const isMicOn = participant.stream.getAudioTracks()[0]?.enabled || false;
            const isCamOn = participant.stream.getVideoTracks()[0]?.enabled || false;
            if(participant.isMe) {
                if(participant.stream.getVideoTracks()[0]) {
                    const videoTrack = participant.stream.getVideoTracks()[0]
                    tempStream.addTrack(videoTrack)
                }
            } else {
                tempStream = participant.stream;
                elementRef.current.volume = 0.9;
            }
            elementRef.current.volume = 0;
            elementRef.current.muted = true;
            elementRef.current!.srcObject = tempStream;
            elementRef.current!.autoplay = true;
            // @ts-ignore
            // elementRef.current?.setSinkId(speaker?.deviceId || '').then(() => {
            //     console.log('🟡setSinkId success',speaker?.deviceId || '');
            //   })
            //   .catch((err: any) => {
            //     console.log('🟡setSinkId error', err);
            //   });
            setStreamVideo(tempStream)
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