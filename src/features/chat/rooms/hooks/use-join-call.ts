import { joinHelpDeskVideoCallRoom, joinVideoCallRoom } from '@/services/video-call.service';
import { useChatBox } from '../contexts';
import { IRoom, useVideoCallStore } from '@/features/call/store/video-call.store';
import { useAuthStore } from '@/stores/auth.store';
import { STATUS } from '@/features/call/constant/status';
import toast from 'react-hot-toast';
import { CALL_TYPE, JOIN_TYPE } from '@/features/call/constant/call-type';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { roomApi } from '../api';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { StatusParticipant } from '@/features/call/interfaces/participant';
import customToast from '@/utils/custom-toast';
import { Room } from '../types';
import openPopupWindow from '@/utils/open-popup-window';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';

interface CallResponse {
  call: IRoom,
  room: Room;
  status: string,
  type: string
}
export const useJoinCall = () => {
  const { user } = useAuthStore();
  const { postMessage } = useReactNativePostMessage();
  const { setRoom, room, setTempRoom, tmpRoom, setRequestCall } =
    useVideoCallStore();
  const {isBusiness} = useBusinessNavigationData();
  const setLayout = useVideoCallStore((state) => state.setLayout);
  const router = useRouter();
  const { t } = useTranslation('common');
  const { room: roomChatBox, updateRoom } = useChatBox();

  const addParticipant = useParticipantVideoCallStore(
    (state) => state.addParticipant,
  );
  const createRoomMeeting = useCallback(async () => {
    const res = await roomApi.createRoom({
      participants: roomChatBox.participants.map((p) => p._id),
    });
    updateRoom(res);
    router.refresh();
    return res._id; // room id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomChatBox?.participants, updateRoom]);

  const startVideoCall = useCallback(
    async ({
      roomId,
      userId
    }: { roomId: string, userId?: string}) => {
      postMessage({
        type: 'Trigger',
        data: {
          event: 'start-call',
          roomId: roomId,
        },
      });
      if (room?.roomId == roomId) return;
      if (room && !tmpRoom) {
        setTempRoom(roomId);
        return;
      }
      // if have userId, it's help desk call
      let res;
      if(userId) {
        res = await joinHelpDeskVideoCallRoom({ roomId, userId });
      } else {
        res = await joinVideoCallRoom({ roomId });
      }
      const data: CallResponse = res?.data;
      if (data.status === STATUS.ROOM_NOT_FOUND) {
        const newRoomId = await createRoomMeeting();
        startVideoCall({
          roomId: newRoomId,
          userId: userId,
        });
        return;
      }
      if (data.status !== STATUS.JOIN_SUCCESS) {
        customToast.error(t('MESSAGE.ERROR.JOIN_ROOM'));
        return;
      }
      if(data.call.type == CALL_TYPE.HELP_DESK && !isBusiness) {
        const url = `${NEXT_PUBLIC_URL}/help-desk/${roomId}/call/${userId}`;
        const windowName = data.call._id;
        openPopupWindow(url, windowName)
        return;
      }
      if(isBusiness) {
        setLayout(VIDEO_CALL_LAYOUTS.P2P_VIEW)
      }
      setRequestCall();
      setRoom(data?.call);
      if (
        data.type == JOIN_TYPE.NEW_CALL &&
        data.call.type === CALL_TYPE.DIRECT &&
        !data.room.isHelpDesk
      ) {
        // Get participants id except me
        const inviteParticipant = data?.room?.participants.filter(
          (p: any) => p._id !== user?._id,
        );
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, {
          users: [...inviteParticipant],
          call: data?.call,
          user: user,
          type: 'direct'
        });
        setTimeout(() => {
          addParticipant({
            user: inviteParticipant[0],
            socketId: inviteParticipant[0]._id,
            status: StatusParticipant.WAITING,
          });
        }, 500);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      addParticipant,
      setRequestCall,
      createRoomMeeting,
      room,
      setRoom,
      setTempRoom,
      t,
      tmpRoom,
      user,
    ],
  );

  return startVideoCall;
};
