import { Media } from '@/types';
import { PauseCircleIcon, PlayCircleIcon } from 'lucide-react';
import { useRef, useState } from 'react';
export interface MessageItemVideoProps {
  file: Media;
}

export const MessageItemVideo = ({ file }: MessageItemVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div
      onDoubleClick={() => {
        videoRef.current?.requestFullscreen();
      }}
      className="group relative h-fit w-[200px]  overflow-hidden rounded-lg bg-neutral-50"
    >
      <video
        ref={videoRef}
        src={file.url}
        controls={false}
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="h-full w-full"
      />
      {isPlaying ? (
        <div
          className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/35 text-white opacity-0 group-hover:opacity-100"
          onClick={() => {
            videoRef.current?.pause();
          }}
        >
          <PauseCircleIcon />
        </div>
      ) : (
        <div
          className="absolute  left-0 top-0 flex h-full w-full items-center justify-center  text-white"
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
