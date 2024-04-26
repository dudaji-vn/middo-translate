import { memo, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { twMerge } from 'tailwind-merge';
import useLoadStream from '@/features/call/hooks/use-load-stream';
import useFitRatio from '@/features/call/hooks/use-fit-ratio';
import VideoItemLoading from './components/video-item-loading';
import VideoItemAvatar from './components/video-item-avatar';
import useGetVideoSize from '../doodle/hooks/use-get-video-size';
import { DoodleShareScreen } from '../doodle/doodle-share-screen';
import { useTranslation } from 'react-i18next';
import VideoItemTalk from './components/video-item-talk';
import { Maximize, Minimize } from 'lucide-react';
import UserStatus from './components/user-status';
interface FocusVideoItemProps {
  participant?: any;
}
const FocusVideoItem = ({ participant }: FocusVideoItemProps) => {
  const {t} = useTranslation('common')
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const parentRef = useRef<HTMLElement>(null);
  const { streamVideo, isTurnOnCamera } = useLoadStream(participant, videoRef);
  useFitRatio(videoRef, parentRef);
  const { width, height } = useGetVideoSize({ videoRef });
  // Disable pause video when fullscreen
  const [isExpandFull, setIsExpandFull] = useState(false);

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

  useEffect(() => {
    const handleFullScreenEsc = () => {
      const isFullScreen = document.fullscreenElement;
      if(!isFullScreen && isExpandFull){
        setIsExpandFull(false)
      } else if(isFullScreen && !isExpandFull){
        setIsExpandFull(true)
      }
    };
    document.addEventListener('fullscreenchange', handleFullScreenEsc);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenEsc);
    };
  }, [isExpandFull]);

  const setFullScreenWeb = () => {
    // Set web full screen
    const isFullScreen = document.fullscreenElement;
    if(isFullScreen){
      setIsExpandFull(false)
      document.exitFullscreen()
    }else{
      setIsExpandFull(true)
      parentRef.current?.requestFullscreen()
    }

  }
  return (
    <section
      ref={parentRef}
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-900 transition-all',
        isTurnOnCamera ? 'bg-neutral-900' : 'bg-neutral-50',
        isExpandFull && 'fixed top-0 left-0 right-0 bottom-0 z-50',
        // isShowChat && 'h-[200px] md:h-full',
      )}
    >
      <div className="absolute bottom-2 right-2 cursor-pointer hover:opacity-70"
        onClick={setFullScreenWeb}
      >
        {
          isExpandFull ? <Minimize className='text-neutral-700' size={20} /> : <Maximize className='text-neutral-700' size={20} />
        }
      </div>
      <VideoItemTalk stream={streamVideo} />
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
      <div className="absolute bottom-1 left-1 z-10 flex max-w-[90%] items-center justify-center gap-2 rounded-lg bg-black/80 p-2 py-1 text-white">
        <span className="relative truncate leading-snug text-xs">
          {participant?.isMe ? t('CONVERSATION.YOU') : participant?.user?.name || ''}
          {participant?.isShareScreen ? `  (${t('CONVERSATION.SCREEN')})` : ''}
        </span>
      </div>

      {/* Video Loading */}
      <VideoItemLoading
        isMe={participant?.isMe}
        isShareScreen={participant?.isShareScreen}
      />

      {/* Doodle */}
      {participant?.isShareScreen && participant?.isElectron && (
        // {participant?.isShareScreen &&
        <DoodleShareScreen width={width} height={height} />
      )}

        <UserStatus isForgeShow={true} participant={participant}/>
    </section>
  );
};
export default memo(FocusVideoItem);
