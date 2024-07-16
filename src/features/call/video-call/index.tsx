import React, { useEffect } from 'react';
import CallDraggable from '../components/call-draggable';
import VideoCallHeader from './components/video-call-header';
import { useVideoCallStore } from '../store/video-call.store';
import { VideoCallProvider } from '../context/video-call-context';
import VideoCallActions from './components/video-call-actions';
import VideoCallContent from './components/video-call-contents';
import { cn } from '@/utils/cn';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useParticipantVideoCallStore } from '../store/participant.store';
import { useAuthStore } from '@/stores/auth.store';
import { StatusParticipant } from '../interfaces/participant';
import { useAppStore } from '@/stores/app.store';
import useHelpDesk from '../hooks/use-help-desk';

export default function VideoCall() {
  const room = useVideoCallStore(state => state.room);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const setFullScreen = useVideoCallStore(state => state.setFullScreen);
  const participants = useParticipantVideoCallStore(state => state.participants)
  const user = useAuthStore(state => state.user)
  const setRequestCall = useVideoCallStore(state => state.setRequestCall)
  const updateStatusParticipant = useParticipantVideoCallStore(state => state.updateStatusParticipant)
  const isMobile = useAppStore(state => state.isMobile)
  const { isHelpDeskCall } = useHelpDesk();

  useEffect(() => {
    const declineCall = (payload: {
      roomId: string,
      userIds: string[],
    }) => {
      const { roomId, userIds } = payload;
      if(!userIds?.length) return;
      userIds.forEach(userId => {
        let participant = participants.find(p => p.user._id === userId)
        if ((room?._id == roomId || room?.roomId == roomId) && participant) {
          if (participant.status == StatusParticipant.WAITING) {
            updateStatusParticipant(userId, StatusParticipant.DECLINE)
          }
        }
        if(userId === user?._id) {
          setRequestCall()
        }
      })
    }
    socket.on(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, declineCall)
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.DECLINE_CALL, declineCall)
    }
  }, [participants, room?._id, room?.roomId, setRequestCall, updateStatusParticipant, user?._id]);

  useEffect(() => {
    if(isMobile) {
      setFullScreen(true)
    }
  }, [isMobile, setFullScreen])
  if (!room) return null;
  return (
    <CallDraggable
      className={cn(
        'h-fit',
        isFullScreen && 'inset-0 !h-full !w-full !left-0 !bottom-0 !rounded-none md:rounded-none translate-x-0 translate-y-0'
      )}
    >
      <VideoCallProvider>
        <VideoCallHeader />
        <div className="relative flex-1 overflow-hidden">
          <div className="flex h-full w-full flex-col">
            <VideoCallContent />
            <VideoCallActions 
              isShowChat={!isHelpDeskCall}
              isShowDrawer={!isHelpDeskCall}
              isShowDropdown={!isHelpDeskCall}
              isShowVideoSetting={isHelpDeskCall}
              isShowToggleCaption={isHelpDeskCall}
              className={isHelpDeskCall ? 'md:gap-3' : ''}
            />
          </div>
        </div>
      </VideoCallProvider>
    </CallDraggable>
  );
}
