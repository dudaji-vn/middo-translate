import getThumbnailForVideo from '@/utils/get-thumbnail-for-video';
import { useEffect, useState } from 'react';
import Lightbox, { Slide } from 'yet-another-react-lightbox';
import Download from 'yet-another-react-lightbox/plugins/download';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Video from 'yet-another-react-lightbox/plugins/video';
import { Media } from '@/types';
import { SelectedFile } from './media-upload';
import MediaLightBox from './media-light-box';

export interface MediaPreviewProps {
    files: (SelectedFile | Media )[];
    index?: number;
    close: () => void;
    fetchNextPage?: () => void;
}

export const MediaPreview = ({ files, index, close, fetchNextPage }: MediaPreviewProps) => {
    const [sliders, setSliders] = useState<Slide[]>([]);
    useEffect(() => {
        const generateSlides = async () => {
          const finalSlides: any[] = [];
          files.forEach(async (file) => {
            // @ts-ignore
            const fileType = file?.type || file?.file?.type.split('/')[0];
            switch (fileType) {
              case 'video':
                const thumbnailPoster = await getThumbnailForVideo(file.url);
                finalSlides.push({
                  type: "video",
                  width: 1280,
                  height: 720,
                  poster: thumbnailPoster,
                  sources: [
                    {
                      src: file.url,
                      type: file?.file?.type,
                    },
                  ],
                });
                break;
              default:
                finalSlides.push({
                  src: file.url,
                  title: file.file?.name || '',
                  width: 1000,
                  height: 1000,
                });
            }
          });
          setSliders(finalSlides);
        }
        generateSlides();
      }, [files]);
  return (
    <Lightbox
        slides={sliders}
        index={index}
        open={index !== undefined}
        carousel={{
            finite: false,
        }}
        close={close}
        plugins={[Download, Thumbnails, Zoom, Video]}
        on={{
            view: ({ index }) => {
              if (index >= files.length - 1 && typeof fetchNextPage === 'function') {
                fetchNextPage();
              }
            },
        }}
    />
  );
};
