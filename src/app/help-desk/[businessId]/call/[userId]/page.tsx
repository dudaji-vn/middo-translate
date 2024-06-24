'use client';

import { Button } from '@/components/actions';
import { PageLoading } from '@/components/feedback';
import { BusyImage } from '@/components/icons/busy-image';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useGetRoomData } from '@/features/business-spaces/hooks/use-get-chat-room';
import { CommonComponent } from '@/features/call/components/common/common';
import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';
import { STATUS } from '@/features/call/constant/status';
import useHelpDeskCall from '@/features/call/hooks/socket/use-help-desk-call';
import useSocketVideoCall from '@/features/call/hooks/socket/use-socket-video-call';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import VideoCall from '@/features/call/video-call';
import { Room } from '@/features/chat/rooms/types';
import socket from '@/lib/socket-io';
import { getHelpDeskCallInformation } from '@/services/video-call.service';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { createContext, useContext, useEffect, useState } from 'react';

export type VideoCallHelpDeskContextType =
  | 'WAITING'
  | 'JOINED'
  | 'BLOCK'
  | 'BUSY';
interface VideoCallHelpDeskContextProps {
  status: 'WAITING' | 'JOINED' | 'BLOCK' | 'BUSY';
  setStatus: (status: VideoCallHelpDeskContextType) => void;
  businessData: Room;
}

const VideoCallHelpDeskContext = createContext<VideoCallHelpDeskContextProps>(
  {} as VideoCallHelpDeskContextProps,
);

interface HelpDeskCallProps {
  params: {
    userId: string;
    businessId: string;
  };
}

const HelpDeskCall = ({ params }: HelpDeskCallProps) => {
  const setRoom = useVideoCallStore((state) => state.setRoom);
  const setFullScreen = useVideoCallStore((state) => state.setFullScreen);
  const setLayout = useVideoCallStore((state) => state.setLayout);
  const setData = useAuthStore((state) => state.setData);
  const socketConnected = useAppStore((state) => state.socketConnected);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  useSocketVideoCall();
  const [status, setStatus] = useState<VideoCallHelpDeskContextType>('WAITING');
  const { userId, businessId } = params;
  const { data } = useGetRoomData({
    roomId: businessId,
    userId,
  });
  useEffect(() => {
    const fetchCall = async () => {
      try {
        let res = await getHelpDeskCallInformation(businessId, userId);
        const { call, status, user } = res.data;
        if (status === STATUS.MEETING_STARTED) {
          setRoom(call);
          setData({
            user: user,
          });
          setFullScreen(true);
          setLayout(VIDEO_CALL_LAYOUTS.P2P_VIEW);
          setStatus('JOINED');
        } else {
          setStatus('BLOCK');
        }
      } catch (error) {
        window.close();
      }
    };
    fetchCall();
  }, [params, setData, setFullScreen, setLayout, setRoom]);

  useEffect(() => {
    const blockJoinMeeting = () => {
      setStatus('BLOCK');
    };
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.BLOCK, blockJoinMeeting);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.BLOCK, blockJoinMeeting);
    };
  }, []);

  useEffect(() => {
    if (!isFullScreen) {
      setFullScreen(true);
    }
  }, [isFullScreen]);
  
  if (!socketConnected || !data || status == 'WAITING') return <PageLoading />;

  if (status == 'BLOCK') return <BlockCall />;

  if (status == 'BUSY') return <BusyCall />;

  return (
    <VideoCallHelpDeskContext.Provider
      value={{
        status: status,
        setStatus: setStatus,
        businessData: data.data,
      }}
    >
      <HelpDeskCallContent />
    </VideoCallHelpDeskContext.Provider>
  );
};

export default HelpDeskCall;

export const useHelpDeskCallContext = () => {
  const context = useContext(VideoCallHelpDeskContext);
  if (!context) {
    throw new Error(
      'useHelpDeskCallContext must be used within VideoCallHelpDeskContext',
    );
  }
  return context;
};

const HelpDeskCallContent = () => {
  useHelpDeskCall();
  return (
    <>
      <VideoCall />
      <CommonComponent />
    </>
  );
};

const BlockCall = () => {
  return (
    <div>
      <p>Sorry, You can not join this meeting </p>
    </div>
  );
};

const BusyCall = () => {
  const [time, setTime] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time == 0) {
      window.close();
    }
  }, [time]);

  return (
    <div className="mx-auto flex max-h-[90vh] flex-col justify-center gap-5 p-2">
      <BusyImage className="mx-auto w-1/2" />
      <div>
        <p className="text-center text-xl font-semibold">
          Our staffs are busy, please call again later!
        </p>
        <p className="mt-1 text-center text-sm text-neutral-600">
          (This tab will automatically close after {time}s)
        </p>
      </div>
      <Button
        variant={'default'}
        color={'primary'}
        shape={'square'}
        className="mx-auto block max-w-[50%]"
        onClick={() => {
          window.close();
        }}
      >
        Close this tab
      </Button>
    </div>
  );
};
