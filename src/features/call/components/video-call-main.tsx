'use client';

import { VideoCallBottom } from "@/features/call/components/call-bottom";
import VideoCallContent from "@/features/call/components/call-content";
import { VideoCallProvider } from "@/features/call/context/video-call-context";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
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
