import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useChatBox } from '../contexts';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { checkRoomIsHaveMeetingService } from '@/services/call.servide';
import { STATUS } from '@/features/call/constant/status';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { listenEvent } from '@/features/call/utils/custom-event.util';

export const useCheckHaveMeeting = (roomId: string) => {
    const [isHaveMeeting, setHaveMeeting] = useState(false);
    const { room, removeRequestCall } = useVideoCallStore();
    useEffect(() => {
        if (!roomId) return;
        const checkHaveMeeting = async () => {
          let res = await checkRoomIsHaveMeetingService(roomId);
          const data = res.data;
          if (data.status === STATUS.MEETING_STARTED) {
            setHaveMeeting(true);
          } else {
            setHaveMeeting(false);
          }
        };
        checkHaveMeeting();
    }, [room, roomId]);


    useEffect(() => {
      const cleanupMeetingEnd = listenEvent('MEETING_END', (event: any) => {
        const { detail: roomIdEnd } = event
        if(roomIdEnd === roomId) {
          setHaveMeeting(false)
        }
      })
      const cleanupMeetingStart = listenEvent('MEETING_START', (event: any) => {
        const { detail: roomIdStart } = event
        if(roomIdStart === roomId) {
          setHaveMeeting(true)
        }
      })
      return () => {
        cleanupMeetingEnd();
        cleanupMeetingStart();
      }
    }, [roomId]);
    return isHaveMeeting;
};
