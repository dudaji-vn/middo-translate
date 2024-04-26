import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import { PhoneMissed } from 'lucide-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface UserStatusProps {
  isForgeShow?: boolean;
  participant: ParticipantInVideoCall
}
export default function UserStatus({isForgeShow, participant}: UserStatusProps) {
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const layout = useVideoCallStore(state => state.layout);
  if(layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW && isFullScreen && !isForgeShow) return null;

  switch (participant.status) {
    case 'WAITING':
      return <WaitingStatus />
    case 'DECLINE':
      return <DeclineStatus participant={participant}/>
    default:
      return null;
  }
}

const WaitingStatus = () => {
  const {t} = useTranslation('common')
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);

  return (
    <div className="absolute inset-0">
      <div className={cn("absolute right-0 top-0 bg-primary-100 p-2 px-3 rounded-bl-xl flex items-center justify-end gap-2")}>
      {isFullScreen && <span className='text-xs text-neutral-bg-neutral-600'>{t('COMMON.WAITING')}</span>}
        <div className='w-fit inline-flex space-x-[3px]'>
        <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-600 [animation-delay:-0.2s]"></div>
        <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-600 [animation-delay:-0.1s]"></div>
        <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-600"></div>
        </div>
      </div>
    </div>
  );
}

const DeclineStatus = ({participant}: {participant: ParticipantInVideoCall}) => {
  const {t} = useTranslation('common')
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const removeParticipantByUserId = useParticipantVideoCallStore(state => state.removeParticipantByUserId)
  useEffect(()=> {
    // set time to remove
    const timeout = setTimeout(()=> {
      removeParticipantByUserId(participant?.user?._id)
    }, 5000)
    return () => {
      clearTimeout(timeout)
    }
  }, [participant?.user?._id, removeParticipantByUserId])

  return (
    <div className="absolute inset-0">
      <div className={cn("absolute right-0 top-0 bg-error-100 p-2 px-3 rounded-bl-xl flex items-center justify-end gap-2 text-error")}>
      {isFullScreen && <span className='text-xs text-neutral-bg-neutral-600'>{t('COMMON.DECLINE')}</span>}
        <PhoneMissed  size={16} />
      </div>
    </div>
  );
}