import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '../../stores';

export const useCheckHaveMeeting = (roomId: string, isBusiness?: boolean) => {
  const meetingList = useChatStore((state) => state.meetingList);
  const user = useAuthStore((state) => state.user);
  const meeting = meetingList[roomId];
  if (!meeting) return false;
  if (!isBusiness) return true;
  // CASE: Business
  if (meeting.participantsIdJoined.length >= 2) return false;
  if(meeting.whiteList && meeting.whiteList.length > 0 && !meeting.whiteList.includes(user?._id || '')) return false;
  return true;
};
