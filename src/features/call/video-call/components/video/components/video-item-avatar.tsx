import { Avatar } from '@/components/data-display';
import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall, { StatusParticipant } from '@/features/call/interfaces/participant';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface VideoItemAvatarProps {
    participant?: ParticipantInVideoCall;
    size?: 'sm' | 'md' | 'lg';
    isTurnOnCamera?: boolean;
}
export default function VideoItemAvatar({participant, size = 'sm', isTurnOnCamera}: VideoItemAvatarProps) {
  const {t} = useTranslation('common')

  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const layout = useVideoCallStore(state => state.layout);

  const isGalleryView = layout == VIDEO_CALL_LAYOUTS.GALLERY_VIEW
  const statusClass = useMemo(()=> {
    switch (participant?.status) {
      case StatusParticipant.WAITING:
      case StatusParticipant.DECLINE:
        return 'opacity-10'
      case StatusParticipant.WAITING_HELP_DESK:
        return 'opacity-[0.05]'
      default:
    }
  }, [participant?.status])
  return (
    <div
      className={cn(
        'absolute left-1/2 top-1/2 flex max-h-full w-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center',
        isTurnOnCamera ? 'pointer-events-none hidden cursor-none' : '',
        statusClass
      )}
    >
      <div
        className={cn(
          'aspect-square max-w-[90%] max-h-[90%] ',
            size === 'sm' && ' w-9',
            size === 'md' && ' w-16',
            size === 'lg' && ' w-40',
          isFullScreen && isGalleryView && 'md:w-[64px]',
        )}
      >
        <Avatar
          className="h-full w-full bg-neutral-900 object-cover"
          src={participant?.user?.avatar || '/avatar_default.svg'}
          alt={participant?.user?.name || 'Anonymous'}
        />
      </div>
      {/* {layout === VIDEO_CALL_LAYOUTS.GALLERY_VIEW && isFullScreen && (
        <span className="relative mt-2 block w-full truncate px-1 text-center leading-snug">
          {participant?.isMe ? t('CONVERSATION.YOU') : participant?.user?.name || ''}
          {participant?.isShareScreen ? `  (${t('CONVERSATION.SCREEN')})` : ''}
        </span>
      )} */}
    </div>
  );
}
