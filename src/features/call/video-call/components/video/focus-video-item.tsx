import { memo, useEffect, useRef } from 'react';
import { Maximize } from 'lucide-react';
import { cn } from '@/utils/cn';
import { twMerge } from 'tailwind-merge';
import useLoadStream from '@/features/call/hooks/use-load-stream';
import useAudioLevel from '@/features/call/hooks/use-audio-level';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import useFitRatio from '@/features/call/hooks/use-fit-ratio';
import VideoItemLoading from './components/video-item-loading';
import VideoItemAvatar from './components/video-item-avatar';
import { DoodleArea } from '../doodle/doodle-area';
import useGetVideoSize from '../doodle/hooks/use-get-video-size';
import { DoodleShareScreen } from '../doodle/doodle-share-screen';
import { useTranslation } from 'react-i18next';
interface FocusVideoItemProps {
  participant?: any;
}
const FocusVideoItem = ({ participant }: FocusVideoItemProps) => {
  const {t} = useTranslation('common')
  const isLoadingVideo = useMyVideoCallStore((state) => state.isLoadingVideo);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const parentRef = useRef<HTMLElement>(null);
  const { streamVideo, isTurnOnCamera } = useLoadStream(participant, videoRef);
  const { isTalk } = useAudioLevel(streamVideo);
  useFitRatio(videoRef, parentRef);
  const { width, height } = useGetVideoSize({ videoRef });
  // Disable pause video when fullscreen
  
  useEffect(() => {
    if (!videoRef.current) return;
    let videoRefTmp = videoRef.current;
    const handleDisablePauseVideo = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      videoRefTmp.play();
    };

    videoRefTmp.addEventListener('pause', handleDisablePauseVideo);
    return () => {
      if (!videoRefTmp) return;
      videoRefTmp.removeEventListener('pause', handleDisablePauseVideo);
    };
  }, [streamVideo]);

  return (
    <section
      ref={parentRef}
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-900 transition-all',
        isTurnOnCamera ? 'bg-neutral-900' : 'bg-neutral-50',
        // isShowChat && 'h-[200px] md:h-full',
      )}
    >
      <div
        className={twMerge(
          'pointer-events-none absolute inset-0 z-10 rounded-xl border-4 border-primary transition-all',
          isTalk ? 'opacity-100' : 'opacity-0',
        )}
      ></div>
      <video
        ref={videoRef}
        className={twMerge(
          'disable relative h-full w-full object-contain',
          isTurnOnCamera ? '' : 'hidden',
        )}
        autoPlay
        muted
        playsInline
        controls={false}
      ></video>
      {/* Overlay black gradient from bottom to top */}
      {/* {isTurnOnCamera  && (
        <div className="absolute bottom-0 left-0 right-0 top-1/2 hidden items-end justify-end bg-gradient-to-t p-3 transition-all md:flex md:hover:from-black/70">
          <Maximize
            className="h-5 w-5 cursor-pointer stroke-white"
            onClick={fullScreenVideo}
          />
        </div>
      )} */}

      {/* Overlay name */}
      <VideoItemAvatar
        size="lg"
        participant={participant}
        isTurnOnCamera={isTurnOnCamera}
      />

      {/* Overlay name */}
      <div className="absolute bottom-1 left-1 z-10 flex max-w-[90%] items-center justify-center gap-2 rounded-xl bg-black/80 p-2 text-white">
        <span className="relative truncate leading-snug">
          {participant?.isMe ? t('CONVERSATION.YOU') : participant?.user?.name || ''}
          {participant?.isShareScreen ? `  (${t('CONVERSATION.SCREEN')})` : ''}
        </span>
      </div>

      {/* Video Loading */}
      <VideoItemLoading
        isLoading={isLoadingVideo}
        isMe={participant?.isMe}
        isShareScreen={participant?.isShareScreen}
      />

      {/* Doodle */}
      {participant?.isShareScreen && participant?.isElectron && (
        // {participant?.isShareScreen &&
        <DoodleShareScreen width={width} height={height} />
      )}
    </section>
  );
};
export default memo(FocusVideoItem);
