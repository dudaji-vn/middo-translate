import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import React from 'react';
import { twMerge } from 'tailwind-merge';
interface VideoItemTextProps {
  participant?: ParticipantInVideoCall;
}
export default function VideoItemText({ participant }: VideoItemTextProps) {
  const { isPinDoodle, layout, isFullScreen } = useVideoCallStore();
  if (!participant) return null;
  return (
    <>
      {/* Text overlay focus view when pin */}
      <div
        className={cn(
          '1234 pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/90 opacity-0',
          participant.pin &&
            !isPinDoodle &&
            isFullScreen &&
            layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW &&
            'opacity-100',
        )}
      >
        <p className="truncate px-1 text-sm leading-snug text-white">
          {participant.isMe ? 'You' : participant?.user?.name || ''}
          {participant?.isShareScreen ? '  (Screen)' : ''}
        </p>
      </div>
      {/* Text Bottom */}
      {(!participant.pin || layout == VIDEOCALL_LAYOUTS.GALLERY_VIEW) && (
        <div className="pointer-events-none absolute bottom-1 z-10 w-full px-1">
          <div className="pointer-events-none w-fit max-w-full cursor-none rounded-full  bg-black/80 px-2  py-1">
            <p className="truncate px-1 text-sm leading-snug text-white">
              {participant.isMe ? 'You' : participant?.user?.name || ''}
              {participant?.isShareScreen ? '  (Screen)' : ''}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
