import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import { Fullscreen } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
interface ExpandVideoProps {
  isGalleryView?: boolean;
  participant: ParticipantInVideoCall;
}
const ExpandVideo = ({ isGalleryView, participant }: ExpandVideoProps) => {
  const {t} = useTranslation('common')

  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const setFullScreen = useVideoCallStore(state => state.setFullScreen);
  const setLayout = useVideoCallStore(state => state.setLayout);
  const setPinShareScreen = useVideoCallStore(state => state.setPinShareScreen);
  const setPinDoodle = useVideoCallStore(state => state.setPinDoodle);
  const pinParticipant = useParticipantVideoCallStore(state => state.pinParticipant);
  
  const expandVideoItem = () => {
    if (!isFullScreen) setFullScreen(true);
    setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW);
    if (participant.isShareScreen) setPinShareScreen(true);
    setPinDoodle(false);
    pinParticipant(participant.socketId, participant.isShareScreen || false);
  };
  return (
    <div
      className={cn(
        'absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/80 text-white opacity-0 transition-all z-10',
        isGalleryView && isFullScreen && 'hover:opacity-0 md:hover:opacity-100',
      )}
      onClick={expandVideoItem}
    >
      {isGalleryView && isFullScreen && <Fullscreen className="h-4 w-4" />}
      {isFullScreen && isGalleryView && (
        <p className="text-center">{t('CONVERSATION.EXPAND')}</p>
      )}
    </div>
  );
}

export default memo(ExpandVideo);

