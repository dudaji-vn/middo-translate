import { useParticipantVideoCallStore } from "@/features/call/store/participant.store";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import DoodleItem from "../doodle/doodle-item";
import ParticipantInVideoCall from "@/features/call/interfaces/participant";
import VideoItem from "../video/video-item";
import { DoodleArea } from "../doodle/doodle-area";
import FocusVideoItem from "../video/focus-video-item";
import { useMemo } from "react";
import ParticipantsBar from "../participants-bar/participants-bar";
import { useAuthStore } from "@/stores/auth.store";


const P2PLayout = () => {
    const participants = useParticipantVideoCallStore(state => state.participants)
    const [participantPin, anotherParticipants] = useMemo(()=> {
        const tmpParticipants = [...participants]
        if(tmpParticipants.length == 1) return [tmpParticipants[0], []];
        let pPinIndex: number;
        pPinIndex = tmpParticipants.findIndex((p: ParticipantInVideoCall) => p.pin);
        if(pPinIndex == -1) {
            pPinIndex = tmpParticipants.findIndex((p: ParticipantInVideoCall) => !p.isMe);
        }
        if(pPinIndex == -1) return [tmpParticipants[0], tmpParticipants.slice(1)]
        const pPin = tmpParticipants[pPinIndex]
        tmpParticipants.splice(pPinIndex, 1)
        return [pPin, tmpParticipants]
    }, [participants])
    if(!participantPin) return null;
    
    return (
        <div className="relative flex w-full h-full p-1">
            <div className="flex h-full w-full relative">
                {participantPin && <FocusVideoItem participant={participantPin} isAllowChangeView={false}/>}
                {participantPin && <div className="hidden"> 
                    <VideoItem participant={participantPin} />
                </div>}
            </div>
            <ParticipantsBar participants={anotherParticipants}/>
        </div>
    );
};

export default P2PLayout;