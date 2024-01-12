'use client';

import { ROUTE_NAMES } from "@/configs/route-name";
import { SOCKET_CONFIG } from "@/configs/socket";
import { VideoCallBottom } from "@/features/call/components/call-bottom";
import VideoCallContent from "@/features/call/components/call-content";
import { VideoCallHeader } from "@/features/call/components/call-header";
import { ParticipantListSidebar } from "@/features/call/components/participant-list";
import { STATUS } from "@/features/call/constant/status";
import { VideoCallProvider } from "@/features/call/context/video-call-context";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import socket from "@/lib/socket-io";
import { getVideoCall } from "@/services/video-call.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParticipantVideoCallStore } from "../store/participant.store";
import { Spinner } from "@/components/feedback";
import ChatThread from "./chat-thread";

interface VideoCallPageProps {
  params: { id: string };
}
const VideoCallPage = () => {
  const { room,  } = useVideoCallStore();
  const {participants} = useParticipantVideoCallStore();

  if(!room) return null;
  return <VideoCallProvider>
    <div className="flex w-full h-full">
        <main className="w-full h-full flex flex-col overflow-hidden relative">
        {/* <VideoCallHeader /> */}
        <section className="relative flex justify-center h-full w-full flex-1 overflow-hidden min-h-[70px]">
            {/* <ParticipantListSidebar /> */}
            {participants.length == 0 ? <div className='h-full w-full flex-1 rounded-xl min-h-[70px] flex items-center justify-center'><Spinner className='text-primary' /></div> : <VideoCallContent /> }
        </section>
        <VideoCallBottom />
        </main>
        <ChatThread />
    </div>
  </VideoCallProvider>
};

export default VideoCallPage;
