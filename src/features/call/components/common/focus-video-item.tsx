import { memo, useEffect, useRef } from 'react';
import { Maximize } from 'lucide-react';
import useLoadStream from '../../hooks/use-load-stream';
import trimLongName from '../../utils/trim-long-name.util';
import useFitRatio from '../../hooks/use-fit-ratio';
import { useVideoCallStore } from '../../store/video-call.store';
import { cn } from '@/utils/cn';
import { twMerge } from 'tailwind-merge';
import { Avatar } from '@/components/data-display';
import useAudioLevel from '../../hooks/use-audio-level';
import { Spinner } from '@/components/feedback';
import { useMyVideoCallStore } from '../../store/me.store';
interface FocusVideoItemProps {
  participant?: any;
}
const FocusVideoItem = ({ participant }: FocusVideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const parentRef = useRef<HTMLElement>(null);
  const { streamVideo, isTurnOnCamera } = useLoadStream(participant, videoRef);
  const { isTalk } = useAudioLevel(streamVideo);
  const { isLoadingVideo } = useMyVideoCallStore();
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
          'relative h-full w-full object-contain',
          isTurnOnCamera ? '' : 'hidden',
        )}
        autoPlay
        muted
        playsInline
        controls={false}
      ></video>
      {/* Overlay black gradient from bottom to top */}
      {isTurnOnCamera && (
        <div className="absolute bottom-0 left-0 right-0 top-1/2 hidden items-end justify-end bg-gradient-to-t p-3 transition-all md:flex md:hover:from-black/70">
          <Maximize
            className="h-5 w-5 cursor-pointer stroke-white"
            onClick={fullScreenVideo}
          />
        </div>
      )}

      {/* Overlay name */}
      <div
        className={twMerge(
          'absolute left-1/2 top-1/2 flex h-full max-h-full w-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-neutral-50',
          isTurnOnCamera ? 'pointer-events-none hidden cursor-none' : '',
        )}
      >
        <div className="aspect-square w-40 max-w-[90%]">
          <Avatar
            className="h-full w-full bg-neutral-900 object-cover"
            src={participant?.user?.avatar || '/person.svg'}
            alt={participant?.user?.name || 'Anonymous'}
          />
        </div>
      </div>
      {/*  */}
      <div className="absolute bottom-1 left-1 flex max-w-[90%] items-center justify-center gap-2 rounded-xl bg-black/80 p-2 text-white z-10">
        <span className="relative truncate leading-snug">
          {participant?.isMe ? 'You' : participant?.user?.name || ''}
          {participant?.isShareScreen ? '  (Screen)' : ''}
        </span>
      </div>

      {/* Video Loading */}
      {isLoadingVideo && participant.isMe && !participant.isShareScreen && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 pointer-events-none">
            <Spinner className="text-white"></Spinner>
          </div>
        )}
    </section>
  );
};
export default memo(FocusVideoItem);
