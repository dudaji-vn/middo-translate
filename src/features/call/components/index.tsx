'use client';

import { ROUTE_NAMES } from "@/configs/route-name";
import { SOCKET_CONFIG } from "@/configs/socket";
import { VideoCallBottom } from "@/features/call/components/call-bottom";
import VideoCallContent from "@/features/call/components/call-content";
import { VideoCallHeader } from "@/features/call/components/call-header";
import { ParticipantListSidebar } from "@/features/call/components/participant-list";
import { STATUS } from "@/features/call/constant/status";
import { VideoCallProvider } from "@/features/call/context/video-call-context";
import { useVideoCallStore } from "@/features/call/store/video-call";
import socket from "@/lib/socket-io";
import { getVideoCall } from "@/services/videoCallService";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VideoCallPageProps {
  params: { id: string };
}
const VideoCallPage = () => {
  const { user } = useAuthStore();
  const callSlug = '5rn-u6h-hcb111';
  const { room, setRoom, isFullScreen } = useVideoCallStore();
  const [isWaiting, setIsWaiting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if(!user) return;
    const handleGetCall = async () => {
      let res = await getVideoCall(callSlug);
      if(res.data.status == STATUS.JOIN_SUCCESS) {
        setRoom(res.data.call);
      } else if (res.data.status == STATUS.USER_NOT_IN_ROOM){
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM, { roomId: callSlug, user: user});
        setIsWaiting(true);
        socket.on(SOCKET_CONFIG.EVENTS.CALL.ACCEPT_JOIN_ROOM, ({roomInfo}) => {
          setRoom(roomInfo);
          setIsWaiting(false);
        })
        socket.on(SOCKET_CONFIG.EVENTS.CALL.REJECT_JOIN_ROOM, () => {
          setRoom(null);
        })
      } 
      else{
        setRoom(null)
      }
    }
    // handleGetCall();
  }, [callSlug, router, setRoom, user]);

  if(isWaiting) return <WaittingForAccept />
  if(!room) return null;
  return <VideoCallProvider>
    <div className="flex w-full h-full">
        <main className="w-full h-full flex flex-col overflow-hidden relative">
        {/* <VideoCallHeader /> */}
        <section className="relative flex h-full w-full flex-1 overflow-hidden min-h-[70px]">
            {/* <ParticipantListSidebar /> */}
            <VideoCallContent />
        </section>
        <VideoCallBottom />
        </main>
        {/* <aside className={`max-w-[400px] w-full bg-neutral-50 ${isFullScreen ? 'block' : 'hidden'}`}>
            Chat Thread will be here
        </aside> */}
    </div>
  </VideoCallProvider>
};

export default VideoCallPage;

const WaittingForAccept = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center flex-col">
      <div>
        <div className="w-16 h-16 border-4 border-primary border-double rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-1">Waitting for accept from participant in meeting</p>
    </div>
  )
};