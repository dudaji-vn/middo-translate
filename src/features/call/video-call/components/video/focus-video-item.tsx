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
import UserStatus from './components/user-status';
import VideoItemText from './components/video-item-text';
import ChangeToGalleryView from './components/change-to-gallery-view';
import FullScreenButton from './components/full-screen-button';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
interface FocusVideoItemProps {
  participant: ParticipantInVideoCall;
  isAllowChangeView?: boolean;
  isLoadAudio?: boolean;
}
const FocusVideoItem = ({ 
  participant, 
  isAllowChangeView = true,
  isLoadAudio = false
}: FocusVideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const parentRef = useRef<HTMLElement>(null);
  const { isTurnOnCamera } = useLoadStream(participant, videoRef);
  const setLayout = useVideoCallStore(state => state.setLayout);
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
  }, [participant?.stream]);

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

  if(!participant) {
    setLayout(VIDEO_CALL_LAYOUTS.GALLERY_VIEW);
    return null;
  };
  return (
    <section
      ref={parentRef}
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-900 transition-all',
        isTurnOnCamera ? 'bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-900',
        isExpandFull && 'fixed top-0 left-0 right-0 bottom-0 z-50',
        // isShowChat && 'h-[200px] md:h-full',
      )}
    >
      
      <VideoItemTalk stream={participant?.stream} />
      <video
        ref={videoRef}
        className={twMerge(
          'disable relative h-full w-full object-contain',
          isTurnOnCamera ? '' : 'hidden',
        )}
        autoPlay
        muted={participant?.isMe || !isLoadAudio}
        playsInline
        controls={false}
      ></video>
      {/* Overlay name */}
      <VideoItemAvatar
        size="lg"
        participant={participant}
        isTurnOnCamera={isTurnOnCamera}
      />

      <VideoItemText participant={participant} isFocusItem={true}/>

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

      {isAllowChangeView ? 
        <ChangeToGalleryView isExpandFull={isExpandFull}>
          <FullScreenButton setFullScreenWeb={setFullScreenWeb} isExpandFull={isExpandFull} />
        </ChangeToGalleryView> : 
      <FullScreenButton setFullScreenWeb={setFullScreenWeb} isExpandFull={isExpandFull} />}
      
      <UserStatus isForgeShow={true} participant={participant}/>
    </section>
  );
};
export default memo(FocusVideoItem);
