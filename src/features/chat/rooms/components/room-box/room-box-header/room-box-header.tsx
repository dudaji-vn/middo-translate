'use client';

import { AlertCircleIcon, Phone } from 'lucide-react';
import { Button } from '@/components/actions';
import { RoomAvatar } from '../../room-avatar';
import { RoomBoxHeaderNavigation } from './room-box-header-navigation';
import { STATUS } from '@/features/call/constant/status';
import { generateRoomDisplay } from '../../../utils';
import { joinVideoCallRoom } from '@/services/video-call.service';
import { useAuthStore } from '@/stores/auth.store';
import { useChatBox } from '../../../contexts';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { checkRoomIsHaveMeetingService } from '@/services/call.servide';
import { CALL_TYPE, JOIN_TYPE } from '@/features/call/constant/call-type';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { roomApi } from '../../../api';
import { useRoomSidebarTabs } from '../../room-side/room-side-tabs/room-side-tabs.hook';

export const ChatBoxHeader = () => {
  const { room: _room } = useChatBox();
  const currentUserId = useAuthStore((s) => s.user?._id) || '';
  const room = useMemo(
    () => generateRoomDisplay(_room, currentUserId, true),
    [_room, currentUserId],
  );
  return (
    <div className="flex w-full items-center border-b  px-1 py-1 md:px-3">
      <RoomBoxHeaderNavigation />
      <div className="flex items-center gap-2">
        <RoomAvatar isOnline room={room} size={36} />
        <div>
          <p className="line-clamp-1 font-medium">{room.name}</p>
          <p className="text-sm font-light">Online</p>
        </div>
      </div>
      <div className="ml-auto mr-3 flex items-center gap-1">
        <VideoCall />
        <ActionBar />
      </div>
    </div>
  );
};

const ActionBar = () => {
  const { toggleTab, currentSide } = useRoomSidebarTabs();
  const isShowInfo = currentSide === 'info';
  return (
    <div>
      <Button.Icon
        onClick={() => {
          toggleTab('info');
        }}
        size="xs"
        color={isShowInfo ? 'secondary' : 'primary'}
        variant={isShowInfo ? 'default' : 'ghost'}
      >
        <AlertCircleIcon />
      </Button.Icon>
    </div>
  );
};
const VideoCall = () => {
  const { user } = useAuthStore();
  const { setRoom, room, setTempRoom, setMessageId } = useVideoCallStore();
  const { room: roomChatBox, updateRoom } = useChatBox();
  const [isHaveMeeting, setHaveMeeting] = useState(false);
  useEffect(() => {
    if (!roomChatBox?._id) return;
    const checkHaveMeeting = async () => {
      let res = await checkRoomIsHaveMeetingService(roomChatBox?._id);
      const data = res.data;
      if (data.status === STATUS.MEETING_STARTED) {
        setHaveMeeting(true);
      } else {
        setHaveMeeting(false);
      }
    };
    checkHaveMeeting();
  }, [room, roomChatBox, room]);

  const createRoomMeeting = async () => {
    const res = await roomApi.createRoom({
      participants: roomChatBox.participants.map((p) => p._id),
    });
    updateRoom(res);
    return res._id; // room id
  };

  const startVideoCall = async (roomId: string) => {
    let res = await joinVideoCallRoom({ roomId });
    const data = res?.data;
    if (data.status === STATUS.ROOM_NOT_FOUND) {
      const newRoomId = await createRoomMeeting();
      startVideoCall(newRoomId);
      return;
    }
    if (data.status !== STATUS.JOIN_SUCCESS) {
      toast.error('Error when join room');
      return;
    }
    if (room) {
      // If user is in a meeting => set temp room to show modal
      setTempRoom({
        type: data?.type,
        call: data?.call,
        room: data?.room,
      });
    }
    setRoom(data?.call);
    if (
      data.type == JOIN_TYPE.NEW_CALL &&
      data.call.type === CALL_TYPE.DIRECT
    ) {
      // Get participants id except me
      const participants = data?.room?.participants
        .filter((p: any) => p._id !== user?._id)
        .map((p: any) => p._id);
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, {
        users: participants,
        call: data?.call,
        user: user,
      });
    }
  };

  return (
    <div>
      <Button.Icon
        onClick={() => startVideoCall(roomChatBox?._id)}
        size="xs"
        color="primary"
        variant="ghost"
        className={`${isHaveMeeting ? 'hidden' : ''}`}
      >
        <Phone />
        {isHaveMeeting && 'Join call'}
      </Button.Icon>
      <Button
        onClick={() => startVideoCall(roomChatBox?._id)}
        size="xs"
        color="primary"
        variant="ghost"
        className={`${isHaveMeeting ? '' : 'hidden'}`}
        startIcon={<Phone />}
      >
        Join call
      </Button>
    </div>
  );
};
