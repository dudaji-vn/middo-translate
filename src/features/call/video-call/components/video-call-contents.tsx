import React from 'react';
import CaptionSection from './caption';
import ChatThread from './chat-thread';
import VideoCallLayout from './layouts';

export default function VideoCallContent() {
  return (
    <main className="relative flex h-full w-full flex-1 flex-col overflow-hidden md:flex-row">
      <div className='flex h-full w-full flex-1 flex-col overflow-hidden'>
        <section className="relative flex h-full min-h-[70px] w-full flex-1 justify-center overflow-hidden">
          <VideoCallLayout />
        </section>
        <CaptionSection />
      </div>
      <ChatThread />
    </main>
  );
}
