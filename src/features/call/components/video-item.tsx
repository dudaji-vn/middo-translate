import { Mic, VideoOff } from 'lucide-react';
import { memo, useRef } from 'react';

import { Avatar } from '@/components/data-display';
import trimLongName from '../utils/trimLongName';
import { twMerge } from 'tailwind-merge';
import useAudioLevel from '../hooks/useAudioLevel';
import useLoadStream from '../hooks/useLoadStream';
interface VideoItemProps {
  participant?: any;
  size?: 'sm' | 'md' | 'lg';
}
const VideoItem = ({ participant, size = 'md' }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { streamVideo } = useLoadStream(participant, videoRef);
  const { isTalk } = useAudioLevel(streamVideo);
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
      {/* {!participant && <div className={twMerge('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96px] max aspect-square')}>
                <Avatar
                    className='w-full h-full'
                    src='/person.svg'
                    alt='avatar'
                />
            </div>} */}
      {/* <div className='w-full h-full bg-neutral-900 rounded-xl'></div> */}
      <video
        ref={videoRef}
        className="max-h-full w-full flex-1 rounded-xl object-cover"
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
        <VideoOff className="h-5 w-5 stroke-error"></VideoOff>
        <Mic className="h-5 w-5 stroke-neutral-500"></Mic>
      </div>
    </section>
  );
};
export default memo(VideoItem);
