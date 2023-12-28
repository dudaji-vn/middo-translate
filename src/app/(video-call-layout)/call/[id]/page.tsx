import { VideoCallBottom } from "@/features/call/components/call-bottom";
import VideoCallContent from "@/features/call/components/call-content";
import { VideoCallHeader } from "@/features/call/components/call-header";

interface VideoCallPageProps {
  params: {id: string};
}
const VideoCallPage = ({ params } : VideoCallPageProps) => {
  const { id } = params;
  return <main className="h-dvh w-full flex flex-col">
    <VideoCallHeader />
    <section className="flex-1">
      <VideoCallContent></VideoCallContent>
    </section>
    <VideoCallBottom />
  </main>;
};

export default VideoCallPage;
