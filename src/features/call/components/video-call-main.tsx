'use client';

import { VideoCallBottom } from '@/features/call/components/call-bottom';
import VideoCallContent from '@/features/call/components/call-content';
import { VideoCallProvider } from '@/features/call/context/video-call-context';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useParticipantVideoCallStore } from '../store/participant.store';
import { Spinner } from '@/components/feedback';
import ChatThread from './chat-thread';
import CaptionSection from './caption';

const VideoCallPage = () => {
  const { room } = useVideoCallStore();
  const { participants } = useParticipantVideoCallStore();

  if (!room) return null;
  return (
    <VideoCallProvider>
      <div className="flex h-full w-full flex-col">
        <main className="relative flex h-full w-full flex-col md:flex-row flex-1 overflow-hidden">
          {/* <VideoCallHeader /> */}
          <div className='flex flex-col flex-1 overflow-hidden'>
            <section className="relative flex h-full min-h-[70px] w-full flex-1 justify-center overflow-hidden">
              {/* <ParticipantListSidebar /> */}
              {participants.length == 0 ? (
                <div className="flex h-full min-h-[70px] w-full flex-1 items-center justify-center rounded-xl">
                  <Spinner className="text-primary" />
                </div>
              ) : (
                <VideoCallContent />
              )}
            </section>
            <CaptionSection />
          </div>
          <ChatThread />
        </main>
        <VideoCallBottom />
        {/* {!isMobile && <ChatThread />} */}
      </div>
    </VideoCallProvider>
  );
};

export default VideoCallPage;
