import { memo, useEffect, useRef } from 'react';

import { cn } from '@/utils/cn';
import useLoadStream from '@/features/call/hooks/use-load-stream';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import VideoItemAvatar from './components/video-item-avatar';
import ExpandVideo from './components/expand-video';
import VideoItemLoading from './components/video-item-loading';
import VideoItemText from './components/video-item-text';
import VideoItemTalk from './components/video-item-talk';
import GetCaptionUser from './components/get-caption-user';

interface VideoItemProps {
  participant: ParticipantInVideoCall;
  size?: 'sm' | 'md' | 'lg';
  isGalleryView?: boolean;
}
const VideoItem = ({ participant, isGalleryView }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLElement>(null);
  const { isTurnOnCamera, streamVideo } = useLoadStream(participant, videoRef);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  console.log('🟣VideoItem')
  return (
    <section
      ref={itemRef}
      className="flex h-full w-full items-center justify-center p-[2px]"
    >
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-50 transition-all',
          // !isTurnOnCamera && !isFullScreen && 'aspect-square h-[60px] w-[60px]',
          isTurnOnCamera && !isGalleryView && 'w-[100px]',
          !isFullScreen && 'aspect-square h-[60px] w-[60px]',
          !isFullScreen && isGalleryView && isTurnOnCamera && 'w-[100px]',
          isGalleryView && isFullScreen && 'min-h-[200px]',
        )}
      >
        {/* Talk border */}
        <VideoItemTalk stream={streamVideo}/>

        <video
          ref={videoRef}
          className={cn('h-full w-full flex-1 rounded-xl object-cover',
            isTurnOnCamera ? 'block' : 'hidden',
            participant?.isMe ? '' : 'video-participant'
          )}
          playsInline
          controls={false}

        ></video>

        {/* Expand video */}
        <ExpandVideo isGalleryView={isGalleryView} participant={participant}/>
        {/* Avatar */}
        <VideoItemAvatar participant={participant} isTurnOnCamera={isTurnOnCamera}/>
        {/* Name */}
        <VideoItemText participant={participant}/>

        {/* Video Loading */}
        <VideoItemLoading isMe={participant?.isMe} isShareScreen={participant?.isShareScreen} />

          {/* Get Caption */}
        <GetCaptionUser 
          name={participant?.user.name}
          avatar={participant?.user.avatar}
          language={participant?.user.language}
          stream={streamVideo}
        />

        {/* Mic Status */}
        {/* {!isTurnOnMic && 
        <div className='absolute bottom-0 right-0 w-6 h-6 rounded-full bg-neutral-50 p-1'>
          <MicOff className='w-4 h-4 text-error-500 stroke-error-500 bg-neutral-100 rounded-full p-[1px]' />
        </div>} */}
      </div>
    </section>
  );
};

export default memo(VideoItem);

