import { Mic, MicOff, VideoIcon, VideoOff } from 'lucide-react';
import { memo, useRef } from 'react';

import { Avatar } from '@/components/data-display';
import trimLongName from '../utils/trimLongName';
import { twMerge } from 'tailwind-merge';
import useAudioLevel from '../hooks/useAudioLevel';
import useLoadStream from '../hooks/useLoadStream';
import { useVideoCallStore } from '../store';
interface VideoItemProps {
  participant?: any;
  size?: 'sm' | 'md' | 'lg';
}
const VideoItem = ({ participant, size = 'md' }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { streamVideo, isMute, isTurnOnCamera } = useLoadStream(participant, videoRef);
  const { isTalk } = useAudioLevel(streamVideo);
  const {isTurnOnCamera: isMeTurnOnCamera, isMute: isMeMute} = useVideoCallStore();
  if(participant.isMe && videoRef.current) videoRef.current.volume = 0;
  const classForSize = {
    sm: 'w-[240px] mx-1',
    md: '',
    lg: 'h-[480px]',
  };
  return (
    <section
      className={twMerge(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-900 transition-all',
        classForSize[size],
      )}
    >
      <div
        className={twMerge(
          'absolute inset-0 rounded-xl border-4 border-primary transition-all',
          isTalk ? 'opacity-100' : 'opacity-0',
        )}
      ></div>
      {!isTurnOnCamera && <div className={twMerge('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96px] max aspect-square')}>
          <Avatar
              className='w-full h-full'
              src={participant?.user?.avatar || '/person.svg'}
              alt={participant?.user?.name || 'Anonymous'}
          />
      </div>}
      <video
        ref={videoRef}
        className={`h-full w-full flex-1 rounded-xl object-cover ${isTurnOnCamera ? 'block' : 'hidden'}`}
        autoPlay
        muted
        playsInline
        controls={false}
      ></video>
      <div className="absolute bottom-4 left-4 flex items-center justify-center gap-2 rounded-full bg-black/80 p-2 text-white">
        <span className="relative leading-none">
          {trimLongName(participant?.user?.name) || ''}{' '}
          {participant?.isShareScreen ? 'Screen' : ''}
        </span>
        <span className="h-5 w-[1px] bg-neutral-800"></span>
        {(participant?.isMe ? isMeTurnOnCamera : isTurnOnCamera)
          ? <VideoIcon className="h-5 w-5 stroke-neutral-700"></VideoIcon> 
          : <VideoOff className="h-5 w-5 stroke-error"></VideoOff>
        }
        {(participant?.isMe && isMeMute) || (participant && isMute)
          ? <MicOff className="h-5 w-5 stroke-error"></MicOff> 
          : <Mic className="h-5 w-5 stroke-neutral-700"></Mic>}
      </div>
    </section>
  );
};
export default memo(VideoItem);
