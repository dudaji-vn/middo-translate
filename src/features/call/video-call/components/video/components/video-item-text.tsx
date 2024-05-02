import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import { Mic, MicOff } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
interface VideoItemTextProps {
  participant?: ParticipantInVideoCall;
  isFocusItem?: boolean;
}
export default function VideoItemText({ participant, isFocusItem }: VideoItemTextProps) {
  const {t} = useTranslation('common')
  
  const isPinDoodle = useVideoCallStore(state => state.isPinDoodle);
  const layout = useVideoCallStore(state => state.layout);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const isTurnOnMic = useMyVideoCallStore((state) => state.isTurnOnMic);
  console.log('🟣VideoItemText', isTurnOnMic, participant)
  if (!participant) return null;

  const getMicStatus = () => {
    if(participant.isMe) {
      return isTurnOnMic ? <Mic size={16} className='text-neutral-500'></Mic> : <MicOff size={16} className='text-error'></MicOff>
    }
    return participant.isTurnOnMic ? <Mic size={16} className='text-neutral-500'></Mic> : <MicOff size={16} className='text-error'></MicOff>
  }

  if(participant.pin && !isFocusItem && !isPinDoodle && isFullScreen && layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW ) {
    {/* Text overlay focus view when pin */}
    return ( <div
      className='pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/90'
    >
      <p className="px-1 flex items-center justify-center">
        <span className='truncate leading-snug text-white text-xs '>
          {participant.isMe ? t('CONVERSATION.YOU') : participant?.user?.name || ''}
          {participant?.isShareScreen ? `  (${t('CONVERSATION.SCREEN')})` : ''}
        </span>
        {/* <span className='ml-1'>
          <Mic size={16} className='text-neutral-500'></Mic>
        </span> */}
      </p>
    </div>)
  }

  return (
      <div className="pointer-events-none absolute bottom-1 z-10 w-full px-1">
        <div className="pointer-events-none w-fit max-w-full cursor-none rounded-lg  bg-black/80 px-2  py-1">
          <p className="flex items-center justify-center">
            <span className='truncate text-xs leading-snug text-white'>
              {participant.isMe ? t('CONVERSATION.YOU') : participant?.user?.name || ''}
              {participant?.isShareScreen ? `  (${t('CONVERSATION.SCREEN')})` : ''}
            </span>
            {isFullScreen && <span className='w-[1px] bg-neutral-400 h-[15px] mx-2'></span>}
            <span>
              {getMicStatus()}
            </span>
          </p>
        </div>
      </div>
  );
}
