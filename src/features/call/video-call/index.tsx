import React from 'react';
import CallDragable from '../components/call-dragable';
import VideoCallHeader from './components/video-call-header';
import { useVideoCallStore } from '../store/video-call.store';
import { VideoCallProvider } from '../context/video-call-context';
import VideoCallActions from './components/video-call-actions';
import VideoCallContent from './components/video-call-contents';
import { cn } from '@/utils/cn';

export default function VideoCall() {
  const { room } = useVideoCallStore();
  const { isFullScreen } = useVideoCallStore();
  if (!room) return null;
  return (
    <CallDragable
      className={cn(
        'h-fit min-h-[200px]',
        isFullScreen && 'fixed inset-0 !h-full !w-full !left-0 !bottom-0 !rounded-none md:rounded-none !translate-x-0 !translate-y-0'
      )}
    >
      <VideoCallProvider>
        <VideoCallHeader />
        <div className="relative flex-1 overflow-hidden">
          <div className="flex h-full w-full flex-col">
            <VideoCallContent />
            <VideoCallActions />
          </div>
        </div>
      </VideoCallProvider>
    </CallDragable>
  );
}
