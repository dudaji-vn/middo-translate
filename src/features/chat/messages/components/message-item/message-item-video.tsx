import { Media } from '@/types';
import { useRef } from 'react';
export interface MessageItemVideoProps {
  file: Media;
}

export const MessageItemVideo = ({ file }: MessageItemVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      onDoubleClick={() => {
        videoRef.current?.requestFullscreen();
      }}
      className="group relative h-fit w-[280px] overflow-hidden rounded-lg bg-neutral-50"
    >
      <video
        ref={videoRef}
        src={file.url}
        controls
        disablePictureInPicture
        className="h-full w-full"
      />
    </div>
  );
};
