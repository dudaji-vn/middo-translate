import React, { useEffect } from 'react';
import CallDragable from '../components/call-dragable';
import VideoCallHeader from './components/video-call-header';
import { useVideoCallStore } from '../store/video-call.store';
import { VideoCallProvider } from '../context/video-call-context';
import VideoCallActions from './components/video-call-actions';
import VideoCallContent from './components/video-call-contents';
import { cn } from '@/utils/cn';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useParticipantVideoCallStore } from '../store/participant.store';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth.store';
import { StatusParticipant } from '../interfaces/participant';

export default function VideoCall() {
  const {t} = useTranslation('common')
  const room = useVideoCallStore(state => state.room);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const removeParticipantByUserId = useParticipantVideoCallStore(state => state.removeParticipantByUserId)
  const participants = useParticipantVideoCallStore(state => state.participants)
  const user = useAuthStore(state => state.user)
  const removeRequestCall = useVideoCallStore(state => state.removeRequestCall)
  const updateStatusParticipant = useParticipantVideoCallStore(state => state.updateStatusParticipant)

  useEffect(() => {
    const declineCall = (payload: {
      roomId: string,
      userId: string,
    }) => {
      const { roomId, userId } = payload;
      let participant = participants.find(p => p.user._id === userId)
      console.log(participant)
      console.log({room})
      if (room?._id === roomId && participant) {
        if (participant.status == StatusParticipant.WAITING) {
          updateStatusParticipant(userId, StatusParticipant.DECLINE)
        }
      }
      if(userId === user?._id) {
        removeRequestCall(roomId)
      }
    }
    socket.on(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, declineCall)
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, declineCall)
    }
  }, [participants, removeRequestCall, room, updateStatusParticipant, user?._id]);

  if (!room) return null;
  return (
    <CallDragable
      className={cn(
        'h-fit',
        isFullScreen && 'fixed inset-0 !h-full !w-full !left-0 !bottom-0 !rounded-none md:rounded-none !translate-x-0 !translate-y-0'
      )}
    >
      <VideoCallProvider>
        <VideoCallHeader />
        <div className="relative flex-1 overflow-hidden">
          <div className="flex h-full w-full flex-col">
            <VideoCallContent />
            <VideoCallActions />
          </div>
        </div>
      </VideoCallProvider>
    </CallDragable>
  );
}
