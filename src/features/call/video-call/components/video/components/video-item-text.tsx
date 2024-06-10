import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall, {
  StatusParticipant,
} from '@/features/call/interfaces/participant';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Mic, MicOff } from 'lucide-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
interface VideoItemTextProps {
  participant?: ParticipantInVideoCall;
  isFocusItem?: boolean;
}
export default function VideoItemText({
  participant,
  isFocusItem,
}: VideoItemTextProps) {
  const { t } = useTranslation('common');

  const isPinDoodle = useVideoCallStore((state) => state.isPinDoodle);
  const layout = useVideoCallStore((state) => state.layout);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const isTurnOnMic = useMyVideoCallStore((state) => state.isTurnOnMic);
  // console.log('🟣VideoItemText', isTurnOnMic, participant)
  
  const userName = useMemo(() => {
    return `${participant?.isMe ? t('CONVERSATION.YOU') : participant?.user?.name || ''} ${participant?.isShareScreen ? `  (${t('CONVERSATION.SCREEN')})` : ''}`;
  }, [participant?.isMe, participant?.isShareScreen, participant?.user?.name, t]);

  if (!participant) return null;
  
  const getMicStatus = () => {
    if (
      participant.isShareScreen 
    )
      return;

    if (participant.isMe) {
      return (
        <>
          {isFullScreen && !(layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW && !isFocusItem) &&(
            <span className="mx-2 h-[15px] w-[1px] bg-neutral-400"></span>
          )}
          <span>
            {isTurnOnMic ? (
              <Mic size={16} className="text-neutral-500 dark:text-neutral-50"></Mic>
            ) : (
              <MicOff size={16} className="text-error"></MicOff>
            )}
          </span>
        </>
      );
    }
    return (
      <>
        {isFullScreen && !(layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW && !isFocusItem) && (
          <span className="mx-2 h-[15px] w-[1px] bg-neutral-400"></span>
        )}
        <span>
          {participant.isTurnOnMic ? (
            <Mic size={16} className="text-neutral-500"></Mic>
          ) : (
            <MicOff size={16} className="text-error"></MicOff>
          )}
        </span>
      </>
    );
  };

  if (
    participant.pin &&
    !isFocusItem &&
    !isPinDoodle &&
    isFullScreen &&
    layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW
  ) {
    return (
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/90">
        <p className="truncate px-1 text-xs leading-snug text-white">
          {userName}
        </p>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute bottom-[5px] left-[1px] max-w-[calc(100%_-_2px)] z-10 w-full px-1">
      <div className="pointer-events-none w-fit max-w-full cursor-none rounded-lg bg-black/80 px-2  py-1">
        <p className="flex items-center justify-center">
          {isFullScreen && (
            <span className="truncate text-xs leading-snug text-white">
              {userName}
            </span>
          )}
          {getMicStatus()}
        </p>
      </div>
    </div>
  );
}
