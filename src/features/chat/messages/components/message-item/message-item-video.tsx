
import VideoPlayer from '@/components/video/video-player';
import { CUSTOM_EVENTS } from '@/configs/custom-event';
import { sendEvent } from '@/features/call/utils/custom-event.util';
import { useBusinessNavigationData } from '@/hooks';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';
import { useMediaSettingStore } from '@/stores/media-setting.store';
import { Media } from '@/types';
import { announceToParent } from '@/utils/iframe-util';
import { useEffect } from 'react';

export interface MessageItemVideoProps {
  file: Media;
}

export const MessageItemVideo = ({ file }: MessageItemVideoProps) => {
  const isFullScreenStore = useMediaSettingStore((state) => state.isFullScreenStore);
  const {isOnHelpDeskChat} = useBusinessNavigationData();
  const index = useMediaLightBoxStore((state) => state.index);
  const onDisableLongPress = (val: boolean) => {
    sendEvent(CUSTOM_EVENTS.MESSAGE.CHANGE_ALLOW_LONG_PRESS + file.url, val);
  }

  useEffect(() => {
    if(isOnHelpDeskChat && isFullScreenStore) {
      announceToParent({
        type: 'media-show',
      });
    } else if (isOnHelpDeskChat && !isFullScreenStore && typeof index !== 'number') {
      announceToParent({
        type: 'media-close',
      });
    }
  }, [isFullScreenStore]);


  return (
    <VideoPlayer 
      file={{ url: file.url, type: 'video', name: file.name || ''}} 
      className='max-w-[280px] overflow-hidden h-fit rounded-lg'
      onDisableLongPress={onDisableLongPress}
    />
  );
};
