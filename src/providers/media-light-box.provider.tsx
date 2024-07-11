'use client';

import MediaLightBox from '@/components/media-light-box/media-light-box';
import { useBusinessNavigationData } from '@/hooks';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';
import { announceToParent } from '@/utils/iframe-util';
import { useEffect } from 'react';
const MediaLightBoxProvider = () => {
    const index = useMediaLightBoxStore((state) => state.index);
    const files = useMediaLightBoxStore((state) => state.files);
    const { isOnHelpDeskChat } = useBusinessNavigationData();
    useEffect(() => {
        if (isOnHelpDeskChat && typeof index === 'number') {
          announceToParent('media-show');
        } else if(isOnHelpDeskChat && typeof index !== 'number') {
          announceToParent('media-close');
        }
    }, [isOnHelpDeskChat, index]);

    if(typeof index !== 'number' || files.length == 0) return null;

    return <MediaLightBox index={index} files={files} key={index}/>;
  
};

export default MediaLightBoxProvider;
