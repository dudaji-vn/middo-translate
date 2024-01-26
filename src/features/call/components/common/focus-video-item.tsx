import { memo, useEffect, useRef } from 'react';
import { Maximize } from 'lucide-react';
import useLoadStream from '../../hooks/use-load-stream';
import trimLongName from '../../utils/trim-long-name.util';
import useFitRatio from '../../hooks/use-fit-ratio';
import { useVideoCallStore } from '../../store/video-call.store';
import { cn } from '@/utils/cn';
interface FocusVideoItemProps {
  participant?: any;
}
const FocusVideoItem = ({ participant }: FocusVideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const parentRef = useRef<HTMLElement>(null);
  const { streamVideo } = useLoadStream(participant, videoRef);
  const { isShowChat } = useVideoCallStore();
  // const { isTalk } = useAudioLevel(streamVideo)

  useFitRatio(videoRef, parentRef);

  const fullScreenVideo = () => {
    if (!videoRef.current) return;
    // Check is full screen video
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

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
        isShowChat && 'h-[200px] md:h-full',
      )}
    >
      <video
        ref={videoRef}
        className="relative h-full w-full object-contain"
        autoPlay
        muted
        playsInline
        controls={false}
      ></video>
      {/* Overlay black gradient from bottom to top */}
      <div className="absolute bottom-0 left-0 right-0 top-1/2 hidden items-end justify-end bg-gradient-to-t p-3 transition-all md:flex md:hover:from-black/70">
        <Maximize
          className="h-5 w-5 cursor-pointer stroke-white"
          onClick={fullScreenVideo}
        />
      </div>
      <div className="absolute bottom-1 left-1 flex items-center justify-center gap-2 rounded-xl bg-black/80 p-2 text-white">
        <span className="relative leading-none">
          {participant?.isMe
            ? 'You'
            : trimLongName(participant?.user?.name) || ''}
          {participant?.isShareScreen ? '  (Screen)' : ''}
        </span>
      </div>
    </section>
  );
};
export default memo(FocusVideoItem);
