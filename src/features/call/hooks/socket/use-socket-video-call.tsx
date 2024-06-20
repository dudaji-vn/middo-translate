import { SOCKET_CONFIG } from '@/configs/socket';
import { Meeting, useChatStore } from '@/features/chat/stores';
import socket from '@/lib/socket-io';
import { useEffect } from 'react';
import { useVideoCallStore } from '../../store/video-call.store';

export default function useSocketVideoCall() {
  const updateMeetingList = useChatStore((state) => state.updateMeetingList);
  const deleteMeeting = useChatStore((state) => state.deleteMeeting);
  const room = useVideoCallStore((state) => state.room);
  const setRoom = useVideoCallStore((state) => state.setRoom);
  const clearStateVideoCall = useVideoCallStore(state => state.clearStateVideoCall);
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.END, (roomId: string) => {
        deleteMeeting(roomId);
        if (room?.roomId === roomId) {
            setRoom();
            clearStateVideoCall();
        }
    });
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.LIST, (meetings: Meeting) => {
      updateMeetingList(meetings);
    });
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.UPDATE, (meetings: Meeting) => {
      updateMeetingList(meetings);
    });
    return () => {
        socket.off(SOCKET_CONFIG.EVENTS.MEETING.END);
        socket.off(SOCKET_CONFIG.EVENTS.MEETING.LIST);
        socket.off(SOCKET_CONFIG.EVENTS.MEETING.UPDATE);
    }
  }, [room, setRoom, clearStateVideoCall, deleteMeeting, updateMeetingList]);
}
