
import VideoPlayer from '@/components/video/video-player';
import { Media } from '@/types';

export interface MessageItemVideoProps {
  file: Media;
}

export const MessageItemVideo = ({ file }: MessageItemVideoProps) => {
  return (
    <VideoPlayer file={file} className='max-w-[280px] overflow-hidden h-fit rounded-lg'/>
  );
};
