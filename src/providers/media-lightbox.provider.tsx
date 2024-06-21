'use client';

import MediaLightBox from '@/components/media-light-box/media-light-box';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';

const MediaLightBoxProvider = () => {
  const { files, index, setIndex } = useMediaLightBoxStore((state) => state);
  if(index == undefined) return null;
  return (
    <MediaLightBox
      files={files}
      key={index}
      index={index}
      close={() => setIndex(undefined)}
    />
  );
};

export default MediaLightBoxProvider;
