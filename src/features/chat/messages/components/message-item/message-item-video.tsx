import { Button } from '@/components/actions';
import { useAppStore } from '@/stores/app.store';
import { Media } from '@/types';
import { cn } from '@/utils/cn';
import { ExpandIcon, Pause, PlayIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
export interface MessageItemVideoProps {
  file: Media;
}

export const MessageItemVideo = ({ file }: MessageItemVideoProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useAppStore((state) => state.isMobile);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleVideoPlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  }

  // Add on end video event
  useEffect(() => {
    const handleEnd = () => {
      setIsPlaying(false);
      videoRef.current!.currentTime = 0;
    }
    videoRef.current?.addEventListener('ended', handleEnd);
    return () => {
      videoRef.current?.removeEventListener('ended', handleEnd);
    }
  }, [])


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [])

  return (
    <div
      className={cn("group relative h-fit w-[280px] overflow-hidden rounded-lg bg-neutral-50", isFullScreen ? 'fixed inset-0 bg-white z-50 h-full w-full' : '')}
    >
      <video
        ref={videoRef}
        src={file.url}
        controls={false}
        disablePictureInPicture
        className={cn("h-full w-full")}
      />
      {/* Button play */}
      <div className='absolute group inset-3 flex items-center justify-center z-10' onClick={toggleVideoPlay}>
        <Button.Icon
          variant={'default'}
          color={'primary'}
          shape={'default'}
          className={cn('opacity-70 md:opacity-0 group-hover:opacity-70 transition-opacity duration-300', isPlaying ? 'opacity-0' : '', isPlaying && isFullScreen && '!opacity-0')}
        >
          {
            isPlaying ? <Pause /> : <PlayIcon />
          }
        </Button.Icon>
      </div>
      {/* Button expand */}
      <Button.Icon
        variant={'default'}
        color={'primary'}
        size={'ss'}
        shape={'default'}
        className={cn(isFullScreen ? 'z-[51] fixed top-1 right-1' : 'absolute bottom-1 right-1 z-10 opacity-70 transition-opacity duration-300')}
        onClick={() => setIsFullScreen(!isFullScreen)}
      >
        {isFullScreen ? <X /> : <ExpandIcon />}
      </Button.Icon>

    </div>
  );
};
