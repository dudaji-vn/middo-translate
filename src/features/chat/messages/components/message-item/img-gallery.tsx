import Download from 'yet-another-react-lightbox/plugins/download';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Image from 'next/image';
import LightImage from '@/components/data-display/LingboxImage';
import Lightbox from 'yet-another-react-lightbox';
import { Media } from '@/types';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { forwardRef } from 'react';
import useRotate from '@/components/data-display/rotate';

export interface ImgGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: Media[];
}

export const ImgGallery = forwardRef<HTMLDivElement, ImgGalleryProps>(
  ({ images, ...props }, ref) => {
    const length = images.length;
    const isMultiple = length > 1;
    const num = length > 3 ? 3 : length;
    const width = 360 / num;

    const { slides, index, setIndex, Rotate } = useRotate(
      images.map((img) => ({
        src: img.url,
        title: img.name,
        width: img.width,
        height: img.height,
      })),
    );
    return (
      <>
        {isMultiple ? (
          <div
            ref={ref}
            {...props}
            className="grid gap-x-1 gap-y-1"
            style={{
              gridTemplateColumns: `repeat(${num}, minmax(0, 1fr))`,
            }}
          >
            {images.map((img, index) => {
              return (
                <div
                  onClick={() => {
                    setIndex(index);
                  }}
                  key={index}
                  style={{
                    width,
                    height: width,
                  }}
                  className="relative cursor-pointer overflow-hidden rounded-md border border-colors-neutral-50"
                >
                  <Image
                    alt={img.name || img.url}
                    src={img.url}
                    fill
                    quality={50}
                    className="aspect-square object-cover"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Image
            onClick={() => {
              setIndex(0);
            }}
            width={280}
            height={280}
            src={images[0].url}
            alt="img"
            className="cursor-pointer rounded-md"
          />
        )}
        <Lightbox
          index={index}
          open={index !== undefined}
          close={() => setIndex(undefined)}
          slides={slides}
          render={{ slide: LightImage }}
          plugins={[Thumbnails, Download, Fullscreen, Zoom, Rotate]}
        />
      </>
    );
  },
);
ImgGallery.displayName = 'ImgGallery';
