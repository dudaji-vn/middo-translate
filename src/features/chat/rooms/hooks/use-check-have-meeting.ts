import { useEffect, useState } from 'react';
import { checkRoomIsHaveMeetingService } from '@/services/call.servide';
import { STATUS } from '@/features/call/constant/status';
import { listenEvent } from '@/features/call/utils/custom-event.util';
import { CUSTOM_EVENTS } from '@/configs/custom-event';

export const useCheckHaveMeeting = (roomId: string) => {
    const [isHaveMeeting, setHaveMeeting] = useState(false);
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
    }, [roomId]);

    useEffect(() => {
      const cleanupMeetingEnd = listenEvent(CUSTOM_EVENTS.CALL.MEETING_END, (event: any) => {
        const { detail: roomIdEnd } = event
        if(roomIdEnd === roomId) {
          setHaveMeeting(false)
        }
      })
      const cleanupMeetingStart = listenEvent(CUSTOM_EVENTS.CALL.MEETING_START, (event: any) => {
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
