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
    const user = useAuthStore(state => state.user)
    const [participantPin, anotherParticipants] = useMemo(()=> {
        if(participants.length == 1) return [participants[0], []];
        let pPin = participants.find((p: ParticipantInVideoCall) => p.pin);
        if(!pPin) {
            pPin = participants.find((p: ParticipantInVideoCall) => !p.isMe);
        }
        if(!pPin) return [participants[0], []]
        const anotherP = participants.filter((p:ParticipantInVideoCall) => !(p.socketId == pPin?.socketId && !!p?.isShareScreen == !!pPin?.isShareScreen))
        return [pPin, anotherP]
    }, [participants])
    console.error({user, participants, participantPin, anotherParticipants})
    if(!participantPin) return null;
    
    return (
        <div className="relative flex w-full h-full p-1">
            <div className="flex h-full w-full relative">
                {participantPin && <FocusVideoItem participant={participantPin} isAllowChangeView={false}/>}
                {participantPin && <div className="hidden"> 
                    <VideoItem participant={participantPin} />
                </div>}
            </div>
            {anotherParticipants.length > 0 && <ParticipantsBar participants={anotherParticipants}/>}
        </div>
    );
};

export default P2PLayout;