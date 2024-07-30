import { SOCKET_CONFIG } from '@/configs/socket';
import { Meeting, useChatStore } from '@/features/chat/stores';
import socket from '@/lib/socket-io';
import { useEffect } from 'react';
import { useVideoCallStore } from '../../store/video-call.store';

export default function useSocketVideoCall() {
  const updateMeetingList = useChatStore((state) => state.updateMeetingList);
  const deleteMeeting = useChatStore((state) => state.deleteMeeting);
  const call = useVideoCallStore((state) => state.call);
  const setCall = useVideoCallStore((state) => state.setCall);
  const clearStateVideoCall = useVideoCallStore(state => state.clearStateVideoCall);
  const setMeetingList = useChatStore(state => state.setMeetingList);
  const requestCall = useVideoCallStore((state) => state.requestCall);
  const setRequestCall = useVideoCallStore((state) => state.setRequestCall);

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.END, (roomId: string) => {
        deleteMeeting(roomId);
        if (call?.roomId === roomId) {
          setCall(undefined);
          clearStateVideoCall();
        }
        if(requestCall?.id == roomId) {
          setRequestCall();
        }
    });
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.LIST, (meetings: Meeting) => {
      setMeetingList(meetings);
    });
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.UPDATE, (meetings: Meeting) => {
      updateMeetingList(meetings);
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.END);
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.LIST);
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.UPDATE);
    }
  }, [call, setCall,requestCall, setRequestCall, clearStateVideoCall, deleteMeeting, updateMeetingList]);
}
