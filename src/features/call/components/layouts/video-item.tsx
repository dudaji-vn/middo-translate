import { Fullscreen, Mic, MicOff, VideoIcon, VideoOff } from 'lucide-react';
import { memo, useEffect, useMemo, useRef } from 'react';

import { Avatar } from '@/components/data-display';
import trimLongName from '../../utils/trim-long-name.util';
import { twMerge } from 'tailwind-merge';
import useAudioLevel from '../../hooks/use-audio-level';
import useLoadStream from '../../hooks/use-load-stream';
import { useMyVideoCallStore } from '../../store/me.store';
import useCalcLayoutItem from '../../hooks/use-calc-layout-item';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import { useVideoCallStore } from '../../store/video-call.store';
import { VIDEOCALL_LAYOUTS } from '../../constant/layout';
interface VideoItemProps {
  participant?: any;
  size?: 'sm' | 'md' | 'lg';
}
const VideoItem = ({ participant }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLElement>(null);
  const { streamVideo, isTurnOnMic, isTurnOnCamera } = useLoadStream(participant, videoRef);
  const { isTalk } = useAudioLevel(streamVideo);
  const { participants, pinParticipant } = useParticipantVideoCallStore();
  const { setLayout, layout } = useVideoCallStore();
  useCalcLayoutItem(itemRef, participants?.length);
  const { isFullScreen, setFullScreen, setPinShareScreen, setPinDoodle } = useVideoCallStore();
  if (participant.isMe && videoRef.current) videoRef.current.volume = 0;
  const expandVideoItem = () => {
    if(!isFullScreen) setFullScreen(true);
    setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW)
    if(participant.isShareScreen) setPinShareScreen(true)
    setPinDoodle(false)
    pinParticipant(participant.socketId, participant.isShareScreen);
  }
  return (
    <section ref={itemRef} className='p-[2px] flex items-center justify-center max-h-[300px]'>
      <div className={twMerge('relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-50 transition-all', !isTurnOnCamera && !isFullScreen && 'w-[60px] aspect-square')}>
        <div
          className={twMerge(
            'absolute inset-0 rounded-xl border-4 border-primary transition-all',
            isTalk ? 'opacity-100' : 'opacity-0',
          )}
        ></div>
          <div className={twMerge('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full flex flex-col items-center justify-center', isTurnOnCamera ? 'cursor-none pointer-events-none hidden' : '')}>
            <div className='w-6 md:w-[64px] max-w-[90%] aspect-square'>
              <Avatar
                className='w-full h-full bg-neutral-900 object-cover'
                src={participant?.user?.avatar || '/person.svg'}
                alt={participant?.user?.name || 'Anonymous'}

              />
            </div>
            {layout === VIDEOCALL_LAYOUTS.GALLERY_VIEW && isFullScreen && <span className="relative leading-none mt-1 block text-center">{trimLongName(participant?.user?.name) || ''}</span>}
          </div>
          <video
            ref={videoRef}
            className={`h-full w-full flex-1 rounded-xl object-cover ${isTurnOnCamera ? 'block' : 'hidden'}`}
            autoPlay
            muted={participant.isMe ? true : false}
            playsInline
            controls={false}
          ></video>
          <div className='cursor-pointer opacity-0 transition-all hover:opacity-100 absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-1' onClick={expandVideoItem}>
            <Fullscreen className='w-6 h-6' />
            {isFullScreen && layout !== VIDEOCALL_LAYOUTS.FOCUS_VIEW && <p className='text-center'>Click to expand</p>}
          </div>
          
          <p className='leading-none absolute bottom-1 left-1 text-white text-sm cursor-none pointer-events-none'>
            {participant.isMe ? "You" : (trimLongName(participant?.user?.name) || '')}
            {participant?.isShareScreen ? "  (Screen)" : ""}
          </p>
      </div>
    </section>

  );
};
export default memo(VideoItem);
