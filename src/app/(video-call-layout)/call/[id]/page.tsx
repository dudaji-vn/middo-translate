// @ts-nocheck
'use client';

import { VideoCallBottom } from "@/features/call/components/call-bottom";
import VideoCallContent from "@/features/call/components/call-content";
import { VideoCallHeader } from "@/features/call/components/call-header";
import { VideoCallProvider } from "@/features/call/context/video-call-context";

interface VideoCallPageProps {
  params: { id: string };
}
const VideoCallPage = ({ params }: VideoCallPageProps) => {
  const { id: roomId } = params;
  
  return <VideoCallProvider roomId={roomId}>
    <main className="h-dvh w-full flex flex-col">
      <VideoCallHeader />
      <section className="flex-1">
        <VideoCallContent />
      </section>
      <VideoCallBottom />
    </main>
  </VideoCallProvider>
};

export default VideoCallPage;
