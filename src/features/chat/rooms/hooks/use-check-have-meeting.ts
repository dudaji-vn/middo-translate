import { useChatStore } from '../../stores';

export const useCheckHaveMeeting = (roomId: string) => {
    const meetingList = useChatStore(state => state.meetingList)
    return meetingList.includes(roomId)
};
