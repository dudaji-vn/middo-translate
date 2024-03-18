import { Media } from '@/types';
import { cn } from '@/utils/cn';
import { PauseCircleIcon, PlayCircleIcon } from 'lucide-react';
import { useRef, useState } from 'react';
export interface MessageItemVideoProps {
  file: Media;
}

export const MessageItemVideo = ({ file }: MessageItemVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="group relative">
      <video
        ref={videoRef}
        src={file.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
        controls
        className="h-full w-[200px]"
      />

      {isPlaying ? (
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white',
            isPlaying && 'opacity-0 group-hover:opacity-100',
          )}
          style={{ fontSize: '2rem' }}
          onClick={() => {
            videoRef.current?.pause();
          }}
        >
          <PauseCircleIcon />
        </div>
      ) : (
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white',
          )}
          style={{ fontSize: '2rem' }}
          onClick={() => {
            videoRef.current?.play();
          }}
        >
          <PlayCircleIcon />
        </div>
      )}
    </div>
  );
};
