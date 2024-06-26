import { useChatStore } from '../../stores';

export const useCheckHaveMeeting = (roomId: string) => {
  const meetingList = useChatStore((state) => state?.meetingList);
  // if (meetingList === undefined) return false;
  // return meetingList?.includes(roomId);
  return false;
};
