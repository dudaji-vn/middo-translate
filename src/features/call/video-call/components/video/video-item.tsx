import { memo, useMemo, useRef } from 'react';

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
import UserStatus from './components/user-status';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useTranslation } from 'react-i18next';

interface VideoItemProps {
  participant: ParticipantInVideoCall;
  size?: 'sm' | 'md' | 'lg';
  isGalleryView?: boolean;
}
const VideoItem = ({ participant, isGalleryView }: VideoItemProps) => {
  const { t } = useTranslation('common');
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const userName = useMemo(() => {
    return `${
      participant?.isMe ? t('CONVERSATION.YOU') : participant?.user?.name || ''} ${
        participant?.isShareScreen ? `  (${t('CONVERSATION.SCREEN')})` : ''}`;
  }, [participant?.isMe, participant?.isShareScreen, participant?.user?.name, t]);
  return (
    <>
      {isFullScreen ? <VideoItemContent participant={participant} isGalleryView={isGalleryView} /> : 
      <Tooltip 
        title={userName} 
        triggerItem={<VideoItemContent participant={participant} isGalleryView={isGalleryView} />}
      />}
    </>
  );
};

const VideoItemContent = memo(({ participant, isGalleryView }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLElement>(null);
  const { isTurnOnCamera, streamVideo } = useLoadStream(participant, videoRef);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  return (
    <section
      ref={itemRef}
      className={cn("flex h-full w-full items-center justify-center p-[2px] relative", !isFullScreen && 'w-fit mx-auto overflow-hidden')}
    >
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-50 transition-all',
          // !isTurnOnCamera && !isFullScreen && 'aspect-square h-[60px] w-[60px]',
          isTurnOnCamera && !isGalleryView && 'w-[100px]',
          !isFullScreen && 'aspect-square h-[60px] w-[60px]',
          !isFullScreen && isGalleryView && isTurnOnCamera && 'w-[100px]',
          isGalleryView && isFullScreen && 'min-h-[200px] md:min-h-max',
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
          name={participant?.user?.name}
          avatar={participant?.user?.avatar}
          language={participant?.user?.language}
          stream={streamVideo}
        />

        {/* Is waiting for Join */}
        <UserStatus participant={participant}/>

        {/* Mic Status */}
        {/* {!isTurnOnMic && 
        <div className='absolute bottom-0 right-0 w-6 h-6 rounded-full bg-neutral-50 p-1'>
          <MicOff className='w-4 h-4 text-error-500 stroke-error-500 bg-neutral-100 rounded-full p-[1px]' />
        </div>} */}
      </div>
      
    </section>
  );
})

VideoItemContent.displayName = 'VideoItemContent';

export default memo(VideoItem);

