import { joinVideoCallRoom } from '@/services/video-call.service';
import { useChatBox } from '../contexts';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
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

export const useJoinCall = () => {
  const { user } = useAuthStore();
  const { postMessage } = useReactNativePostMessage();
  const { setRoom, room, setTempRoom, tmpRoom, setRequestCall } =
    useVideoCallStore();
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
    async (roomId: string) => {
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
      let res = await joinVideoCallRoom({ roomId });
      const data = res?.data;
      if (data.status === STATUS.ROOM_NOT_FOUND) {
        const newRoomId = await createRoomMeeting();
        startVideoCall(newRoomId);
        return;
      }
      if (data.status !== STATUS.JOIN_SUCCESS) {
        toast.error(t('MESSAGE.ERROR.JOIN_ROOM'));
        return;
      }
      setRequestCall();
      setRoom(data?.call);
      if (
        data.type == JOIN_TYPE.NEW_CALL &&
        data.call.type === CALL_TYPE.DIRECT
      ) {
        // Get participants id except me
        const inviteParticipant = data?.room?.participants.filter(
          (p: any) => p._id !== user?._id,
        );
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, {
          users: [...inviteParticipant],
          room: data?.call,
          user: user,
        });
        setTimeout(() => {
          addParticipant({
            user: inviteParticipant[0],
            socketId: inviteParticipant._id,
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
