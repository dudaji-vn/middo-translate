'use client';

import { ROUTE_NAMES } from '@/configs/route-name';
import { SOCKET_CONFIG } from '@/configs/socket';
import { VideoCallBottom } from '@/features/call/components/call-bottom';
import VideoCallContent from '@/features/call/components/call-content';
import { VideoCallHeader } from '@/features/call/components/call-header';
import { STATUS } from '@/features/call/constant/status';
import { VideoCallProvider } from '@/features/call/context/video-call-context';
import { useVideoCallStore } from '@/features/call/store';
import socket from '@/lib/socket-io';
import { getVideoCall } from '@/services/video-call.service';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface VideoCallPageProps {
  params: { id: string };
}
const VideoCallPage = ({ params }: VideoCallPageProps) => {
  const { user } = useAuthStore();
  const { id: callSlug } = params;
  const { room, setRoom } = useVideoCallStore();
  const [isWaiting, setIsWaiting] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (!user) return;
    const handleGetCall = async () => {
      let res = await getVideoCall(callSlug);
      if (res.data.status == STATUS.JOIN_SUCCESS) {
        setRoom(res.data.call);
      } else if (res.data.status == STATUS.USER_NOT_IN_ROOM) {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM, {
          roomId: callSlug,
          user: user,
        });
        setIsWaiting(true);
        socket.on(
          SOCKET_CONFIG.EVENTS.CALL.ACCEPT_JOIN_ROOM,
          ({ roomInfo }) => {
            setRoom(roomInfo);
            setIsWaiting(false);
          },
        );
        socket.on(SOCKET_CONFIG.EVENTS.CALL.REJECT_JOIN_ROOM, () => {
          router.push(ROUTE_NAMES.ROOT);
        });
      } else {
        router.push(ROUTE_NAMES.ROOT);
      }
    };
    handleGetCall();
  }, [callSlug, router, setRoom, user]);
  if (isWaiting) return <WaittingForAccept />;
  if (!room) return null;
  return (
    <VideoCallProvider>
      <main className="fixed inset-0 flex flex-col overflow-hidden">
        <VideoCallHeader />
        <section className="relative flex h-full w-full flex-1 overflow-hidden">
          <VideoCallContent />
        </section>
        <VideoCallBottom />
      </main>
    </VideoCallProvider>
  );
};

export default VideoCallPage;

const WaittingForAccept = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div>
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-double border-primary border-t-transparent"></div>
      </div>
      <p className="mt-1">Waitting for accept from participant in meeting</p>
    </div>
  );
};
