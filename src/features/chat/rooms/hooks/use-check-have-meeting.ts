import { useChatStore } from '../../stores';

export const useCheckHaveMeeting = (roomId: string) => {
    const meetingList = useChatStore(state => state.meetingList)
    const meeting = meetingList[roomId]
    if(meeting) return true
    return false
};
