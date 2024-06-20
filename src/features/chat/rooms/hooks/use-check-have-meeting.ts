import { useChatStore } from '../../stores';

export const useCheckHaveMeeting = (roomId: string, isBusiness?: boolean) => {
    const meetingList = useChatStore(state => state.meetingList)
    const meeting = meetingList[roomId]
    if(!meeting) return false;
    if(!isBusiness) return true;
    // CASE: Business
    if(meeting.participantsIdJoined.length >= 2) return false;
    return true;
};
