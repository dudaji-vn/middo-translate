import { Avatar } from '@/components/data-display';
import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import React from 'react';

interface VideoItemAvatarProps {
    participant?: ParticipantInVideoCall;
    size?: 'sm' | 'md' | 'lg';
    isTurnOnCamera?: boolean;
}
export default function VideoItemAvatar({participant, size = 'sm', isTurnOnCamera}: VideoItemAvatarProps) {
    const { isFullScreen, layout } = useVideoCallStore();
    const isGalleryView = layout == VIDEOCALL_LAYOUTS.GALLERY_VIEW
  return (
    <div
      className={cn(
        'absolute left-1/2 top-1/2 flex max-h-full w-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center',
        isTurnOnCamera ? 'pointer-events-none hidden cursor-none' : '',
      )}
    >
      <div
        className={cn(
          'aspect-square max-w-[90%] ',
            size === 'sm' && ' w-9',
            size === 'md' && ' w-16',
            size === 'lg' && ' w-40',
          isFullScreen && isGalleryView && 'md:w-[64px]',
        )}
      >
        <Avatar
          className="h-full w-full bg-neutral-900 object-cover"
          src={participant?.user?.avatar || '/person.svg'}
          alt={participant?.user?.name || 'Anonymous'}
        />
      </div>
      {layout === VIDEOCALL_LAYOUTS.GALLERY_VIEW && isFullScreen && (
        <span className="relative mt-2 block w-full truncate px-1 text-center leading-snug">
          {participant?.isMe ? 'You' : participant?.user?.name || ''}
          {participant?.isShareScreen ? '  (Screen)' : ''}
        </span>
      )}
    </div>
  );
}
