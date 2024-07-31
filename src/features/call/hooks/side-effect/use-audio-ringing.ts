import { useEffect, useMemo } from "react";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { StatusParticipant } from "../../interfaces/participant";
import usePlayAudio from "../use-play-audio";
import { useVideoCallStore } from "../../store/video-call.store";
import { CALL_TYPE } from "../../constant/call-type";


export default function useAudioRinging() {
   const participants = useParticipantVideoCallStore(state => state.participants)
   const { playAudio, stopAudio } = usePlayAudio('/mp3/incoming.mp3')
   const call = useVideoCallStore(state => state.call);
   const isHaveWaitingParticipant = useMemo(()=>{
    return participants.some(participant => participant.status === StatusParticipant.WAITING || participant.status === StatusParticipant.WAITING_HELP_DESK)
   }, [participants])

   useEffect(()=> {
    if(isHaveWaitingParticipant && [CALL_TYPE.DIRECT, CALL_TYPE.HELP_DESK].includes(call?.type || '')) {
      playAudio()
    }
    return () => {
      stopAudio()
    }
  }, [playAudio, call?.type, stopAudio, isHaveWaitingParticipant])


}