import Download from 'yet-another-react-lightbox/plugins/download';
import Image from 'next/image';
import LightImage from '@/components/data-display/lingtbox-image';
import Lightbox from 'yet-another-react-lightbox';
import { Media } from '@/types';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { forwardRef } from 'react';
import useRotate from '@/components/data-display/rotate';

export interface ImageGalleryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: Media[];
}

export const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(
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
                  className="relative cursor-pointer overflow-hidden rounded-xl border border-neutral-50"
                >
                  <Image
                    priority
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
            priority
            onClick={() => {
              setIndex(0);
            }}
            width={280}
            height={280}
            src={images[0].url}
            alt="img"
            className="cursor-pointer overflow-hidden rounded-[20px] border border-neutral-50"
          />
        )}
        <Lightbox
          slides={slides}
          index={index}
          open={index !== undefined}
          close={() => setIndex(undefined)}
          plugins={[Download, Rotate, Thumbnails, Zoom]}
          render={{ slide: LightImage }}
        />
      </>
    );
  },
);
ImageGallery.displayName = 'ImageGallery';
