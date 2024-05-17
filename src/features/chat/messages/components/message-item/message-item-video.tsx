
import VideoPlayer from '@/components/video/video-player';
import { CUSTOM_EVENTS } from '@/configs/custom-event';
import { sendEvent } from '@/features/call/utils/custom-event.util';
import { Media } from '@/types';

export interface MessageItemVideoProps {
  file: Media;
}

export const MessageItemVideo = ({ file }: MessageItemVideoProps) => {

  const onDisableLongPress = (val: boolean) => {
    sendEvent(CUSTOM_EVENTS.MESSAGE.CHANGE_ALLOW_LONG_PRESS + file.url, val);
  }

  return (
    <VideoPlayer 
      file={file} 
      className='max-w-[280px] overflow-hidden h-fit rounded-lg'
      onDisableLongPress={onDisableLongPress}
    />
  );
};
