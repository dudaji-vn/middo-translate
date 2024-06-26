'use client';

import MediaLightBox from '@/components/media-light-box/media-light-box';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';
const MediaLightBoxProvider = () => {
    const index = useMediaLightBoxStore((state) => state.index);
    const files = useMediaLightBoxStore((state) => state.files);

    if(typeof index !== 'number' || files.length == 0) return null;

    return <MediaLightBox index={index} files={files} key={index}/>;
  
};

export default MediaLightBoxProvider;
