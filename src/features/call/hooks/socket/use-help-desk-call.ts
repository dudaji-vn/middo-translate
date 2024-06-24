import { useBusinessNavigationData } from "@/hooks/use-business-navigation-data";
import { useEffect } from "react";
import ParticipantInVideoCall, { StatusParticipant } from "../../interfaces/participant";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { useVideoCallStore } from "../../store/video-call.store";
import { useHelpDeskCallContext } from "@/app/help-desk/[businessId]/call/[userId]/page";

export default function useHelpDeskCall()  {
    const { isHelpDesk } = useBusinessNavigationData();
    const participants = useParticipantVideoCallStore(state => state.participants);
    const addParticipant = useParticipantVideoCallStore(state => state.addParticipant);
    const removeWaitingHelpDeskParticipant = useParticipantVideoCallStore(state => state.removeWaitingHelpDeskParticipant);
    const room = useVideoCallStore(state => state.room);
    const {businessData} = useHelpDeskCallContext();
    
    // // Add waiting user if call from help desk
    useEffect(() => {
        if(isHelpDesk) {
            // Check have another user 
            const isHaveAnotherUser = participants.some((p: ParticipantInVideoCall) => !p.isMe);
            if(!isHaveAnotherUser) {
                addParticipant({
                    user: {
                        _id: '',
                        name: room?.name || '',
                        username: '',
                        avatar: businessData.space?.avatar || '',
                        language: 'en',
                        email: '',
                        status: 'active',
                        allowUnknown: true
                    },
                    socketId: '', 
                    status: StatusParticipant.WAITING_HELP_DESK
                });
            }
            
            const isHaveAnyoneJoin = participants.some((p: ParticipantInVideoCall) => !p.isMe && p.status != StatusParticipant.WAITING_HELP_DESK);
            const isHaveWaiting = participants.some((p: ParticipantInVideoCall) => p.status == StatusParticipant.WAITING_HELP_DESK);
            if(isHaveAnyoneJoin && isHaveWaiting) {
                removeWaitingHelpDeskParticipant();
            }
        }
    }, [isHelpDesk, addParticipant, participants, removeWaitingHelpDeskParticipant]);

    // // Rename and avatar all participant not me
    // useEffect(() => {
    //     if(isHelpDesk) {
    //         participants.forEach((p: ParticipantInVideoCall) => {
    //             if(!p.isMe && (p.user.name != room?.name || p.user.avatar != businessData.space?.avatar)) {
    //                 updateParticipant(
    //                     {
    //                         ...p,
    //                         user: {
    //                             ...p.user,
    //                             name: room?.name || '',
    //                             avatar: businessData.space?.avatar || ''
    //                         }
    //                     }, 
    //                 p.user._id);
    //             }
    //         });
    //     }
    // }, [isHelpDesk, participants, room, businessData.space, updateParticipant]);
}